import {
  type ClassificationEvidence,
  type ClassificationResult,
  classifyDocRequestInputSchema,
  classificationResultSchema,
  type DiataxisMode,
  type DimensionScores,
  type ModeScores
} from "../types/index.js";
import {
  addEvidence,
  analyzeMarkdown,
  blankDimensionScores,
  blankModeScores,
  classificationSignals,
  excerptAround,
  modeByScore,
  modeNeeds,
  rankedModes,
  round,
  suggestedStructures
} from "./rubrics.js";

const modeDimensionDefaults: Record<DiataxisMode, Partial<DimensionScores>> = {
  tutorial: { action: 2, skillAcquisition: 2 },
  "how-to": { action: 2, skillApplication: 2 },
  reference: { cognition: 2, skillApplication: 2 },
  explanation: { cognition: 2, skillAcquisition: 2 }
};

export function classifyDocRequest(input: unknown): ClassificationResult {
  const parsed = classifyDocRequestInputSchema.parse(input);
  const text = [
    parsed.title ? `Title: ${parsed.title}` : "",
    `Request: ${parsed.request}`,
    parsed.audience ? `Audience: ${parsed.audience}` : "",
    parsed.existingContent ? `Content:\n${parsed.existingContent}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  const scores = blankModeScores();
  const dimensions = blankDimensionScores();
  const evidence: ClassificationEvidence[] = [];

  scoreTextSignals(text, scores, dimensions, evidence);

  if (parsed.existingContent) {
    scoreMarkdownStructure(parsed.existingContent, scores, dimensions, evidence);
  }

  applyCompassScores(scores, dimensions);

  const ranked = rankedModes(scores);
  const primary = ranked[0] ?? { mode: "how-to" as DiataxisMode, score: 0 };
  const secondary = ranked[1] ?? { mode: "reference" as DiataxisMode, score: 0 };
  const mode = modeByScore(scores);
  const confidence = calculateConfidence(primary.score, secondary.score);
  const warnings = buildWarnings(parsed.declaredMode, mode, confidence, primary.score, secondary);

  const result: ClassificationResult = {
    mode,
    confidence,
    scores: roundScores(scores),
    dimensions: roundDimensions(dimensions),
    evidence: evidence
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10),
    warnings,
    rationale: buildRationale(mode, primary.score, secondary.mode, secondary.score),
    suggestedStructure: suggestedStructures[mode]
  };

  return classificationResultSchema.parse(result);
}

function scoreTextSignals(
  text: string,
  scores: ModeScores,
  dimensions: DimensionScores,
  evidence: ClassificationEvidence[]
): void {
  for (const signal of classificationSignals) {
    for (const pattern of signal.patterns) {
      const match = pattern.exec(text);
      if (!match) {
        continue;
      }

      scores[signal.mode] += signal.weight;
      const dimensionWeights = signal.dimensions ?? modeDimensionDefaults[signal.mode];
      for (const [dimension, weight] of Object.entries(dimensionWeights) as Array<
        [keyof DimensionScores, number]
      >) {
        dimensions[dimension] += weight;
      }

      addEvidence(
        evidence,
        signal.mode,
        signal.signal,
        signal.weight,
        excerptAround(text, match.index)
      );
      break;
    }
  }
}

function scoreMarkdownStructure(
  content: string,
  scores: ModeScores,
  dimensions: DimensionScores,
  evidence: ClassificationEvidence[]
): void {
  const metrics = analyzeMarkdown(content);

  if (metrics.orderedStepCount >= 3) {
    const weight = Math.min(4, 1.5 + metrics.orderedStepCount / 3);
    scores["how-to"] += weight;
    scores.tutorial += Math.max(1, weight - 1.5);
    dimensions.action += weight;
    addEvidence(evidence, "how-to", "ordered procedural steps", weight, `${metrics.orderedStepCount} ordered steps`);
  }

  if (metrics.tableLineCount >= 3 || metrics.optionLikeLineCount >= 3) {
    const weight = Math.min(5, 2 + metrics.tableLineCount / 3 + metrics.optionLikeLineCount / 4);
    scores.reference += weight;
    dimensions.cognition += weight;
    dimensions.skillApplication += 1.5;
    addEvidence(
      evidence,
      "reference",
      "structured facts",
      weight,
      `${metrics.tableLineCount} table lines, ${metrics.optionLikeLineCount} option-like lines`
    );
  }

  if (metrics.expectedResultCount >= 2) {
    const weight = Math.min(3, metrics.expectedResultCount);
    scores.tutorial += weight;
    dimensions.skillAcquisition += weight;
    addEvidence(evidence, "tutorial", "expected-result checks", weight, `${metrics.expectedResultCount} verification cues`);
  }

  if (metrics.commandLineCount >= 2 && metrics.orderedStepCount >= 2) {
    const weight = Math.min(3, metrics.commandLineCount / 2 + 1);
    scores["how-to"] += weight;
    dimensions.action += weight;
    dimensions.skillApplication += 1;
    addEvidence(evidence, "how-to", "commands in a procedure", weight, `${metrics.commandLineCount} command lines`);
  }
}

function applyCompassScores(scores: ModeScores, dimensions: DimensionScores): void {
  scores.tutorial += Math.min(dimensions.action, dimensions.skillAcquisition) * 0.2;
  scores["how-to"] += Math.min(dimensions.action, dimensions.skillApplication) * 0.2;
  scores.reference += Math.min(dimensions.cognition, dimensions.skillApplication) * 0.2;
  scores.explanation += Math.min(dimensions.cognition, dimensions.skillAcquisition) * 0.2;
}

function calculateConfidence(primaryScore: number, secondaryScore: number): number {
  if (primaryScore <= 0) {
    return 0.2;
  }

  const margin = primaryScore - secondaryScore;
  const separation = margin / (primaryScore + secondaryScore + 1);
  const signalStrength = Math.min(0.2, primaryScore / 25);
  return round(Math.max(0.2, Math.min(0.95, 0.35 + separation * 0.45 + signalStrength)));
}

function buildWarnings(
  declaredMode: DiataxisMode | undefined,
  detectedMode: DiataxisMode,
  confidence: number,
  primaryScore: number,
  secondary: { mode: DiataxisMode; score: number }
): string[] {
  const warnings: string[] = [];

  if (declaredMode && declaredMode !== detectedMode && confidence >= 0.45) {
    warnings.push(`Declared mode is ${declaredMode}, but the strongest signals indicate ${detectedMode}.`);
  }

  if (secondary.score > 0 && secondary.score >= primaryScore * 0.7) {
    warnings.push(`Strong secondary ${secondary.mode} signals suggest possible mode confusion.`);
  }

  return warnings;
}

function buildRationale(
  mode: DiataxisMode,
  primaryScore: number,
  secondaryMode: DiataxisMode,
  secondaryScore: number
): string {
  if (primaryScore <= 0) {
    return "No strong Diataxis signals were found; default to a task-oriented how-to shape until more context is available.";
  }

  const secondary =
    secondaryScore > 0 ? ` Secondary signals point to ${secondaryMode}, so review for mixed-mode content.` : "";
  return `Detected ${mode} because the strongest signals match ${modeNeeds[mode]}.${secondary}`;
}

function roundScores(scores: ModeScores): ModeScores {
  return {
    tutorial: round(scores.tutorial),
    "how-to": round(scores["how-to"]),
    reference: round(scores.reference),
    explanation: round(scores.explanation)
  };
}

function roundDimensions(dimensions: DimensionScores): DimensionScores {
  return {
    action: round(dimensions.action),
    cognition: round(dimensions.cognition),
    skillAcquisition: round(dimensions.skillAcquisition),
    skillApplication: round(dimensions.skillApplication)
  };
}
