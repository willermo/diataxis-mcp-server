import path from "node:path";
import {
  type AuditDocPageResult,
  auditDocPageInputSchema,
  auditDocPageResultSchema,
  type AuditFinding,
  type DiataxisMode,
  type ExtractionTarget,
  type ModeConfusion
} from "../types/index.js";
import { classifyDocRequest } from "./classify.js";
import { analyzeMarkdown, modeNeeds, rankedModes } from "./rubrics.js";

export function auditDocPage(input: unknown): AuditDocPageResult {
  const parsed = auditDocPageInputSchema.parse(input);
  const title = parsed.title ?? inferTitle(parsed.content) ?? inferTitleFromPath(parsed.path) ?? "Untitled page";
  const classification = classifyDocRequest({
    title,
    request: `Audit documentation page: ${title}`,
    existingContent: parsed.content,
    declaredMode: parsed.declaredMode
  });
  const metrics = analyzeMarkdown(parsed.content);
  const ranked = rankedModes(classification.scores);

  const modeConfusions = buildModeConfusions(classification.mode, ranked, classification.evidence);
  const extractionTargets = buildExtractionTargets(title, classification.mode, ranked, classification.evidence);
  const findings = buildFindings(parsed, title, classification.mode, metrics, modeConfusions, extractionTargets);
  const nextActions = buildNextActions(classification.mode, findings, extractionTargets);

  const result: AuditDocPageResult = {
    page: {
      title,
      ...(parsed.path ? { path: parsed.path } : {})
    },
    classification,
    ...(parsed.declaredMode ? { declaredMode: parsed.declaredMode } : {}),
    modeConfusions,
    extractionTargets,
    findings,
    nextActions
  };

  return auditDocPageResultSchema.parse(result);
}

function inferTitle(content: string): string | undefined {
  const heading = content.split(/\r?\n/).find((line) => /^#\s+\S/.test(line));
  return heading?.replace(/^#\s+/, "").trim();
}

function inferTitleFromPath(filePath: string | undefined): string | undefined {
  if (!filePath) {
    return undefined;
  }

  const base = path.basename(filePath, path.extname(filePath));
  return base
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildModeConfusions(
  primaryMode: DiataxisMode,
  ranked: Array<{ mode: DiataxisMode; score: number }>,
  evidence: AuditDocPageResult["classification"]["evidence"]
): ModeConfusion[] {
  const primaryScore = ranked[0]?.score ?? 0;
  return ranked
    .filter((entry) => isSecondaryModeSignal(entry.mode, entry.score, primaryMode, primaryScore))
    .slice(0, 3)
    .map((entry) => {
      const severity = entry.score >= primaryScore * 0.75 ? "high" : entry.score >= primaryScore * 0.55 ? "medium" : "low";
      return {
        primaryMode,
        confusedWith: entry.mode,
        severity,
        evidence: evidence
          .filter((item) => item.mode === entry.mode)
          .slice(0, 3)
          .map((item) => `${item.signal}: ${item.excerpt}`),
        recommendation: recommendationForConfusion(primaryMode, entry.mode)
      };
    });
}

function buildExtractionTargets(
  title: string,
  primaryMode: DiataxisMode,
  ranked: Array<{ mode: DiataxisMode; score: number }>,
  evidence: AuditDocPageResult["classification"]["evidence"]
): ExtractionTarget[] {
  const primaryScore = ranked[0]?.score ?? 0;
  return ranked
    .filter((entry) => isSecondaryModeSignal(entry.mode, entry.score, primaryMode, primaryScore))
    .slice(0, 3)
    .map((entry) => ({
      mode: entry.mode,
      suggestedTitle: suggestedExtractionTitle(title, entry.mode),
      reason: `This page has ${entry.mode} signals, but its primary mode is ${primaryMode}.`,
      evidence: evidence
        .filter((item) => item.mode === entry.mode)
        .slice(0, 3)
        .map((item) => `${item.signal}: ${item.excerpt}`)
    }));
}

function isSecondaryModeSignal(
  mode: DiataxisMode,
  score: number,
  primaryMode: DiataxisMode,
  primaryScore: number
): boolean {
  return mode !== primaryMode && score >= 3 && score >= primaryScore * 0.25;
}

function buildFindings(
  input: { declaredMode?: DiataxisMode | undefined; content: string },
  title: string,
  mode: DiataxisMode,
  metrics: ReturnType<typeof analyzeMarkdown>,
  modeConfusions: ModeConfusion[],
  extractionTargets: ExtractionTarget[]
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  if (input.declaredMode && input.declaredMode !== mode) {
    findings.push({
      severity: "high",
      message: `Declared mode ${input.declaredMode} does not match detected mode ${mode}.`,
      evidence: [title],
      recommendation: "Either refactor the page to match its declared mode or move it to the detected mode."
    });
  }

  if (!/^#\s+\S/m.test(input.content)) {
    findings.push({
      severity: "low",
      message: "Page has no top-level Markdown title.",
      evidence: [],
      recommendation: "Add a title that names the user need clearly."
    });
  }

  if (mode === "tutorial" && metrics.expectedResultCount === 0) {
    findings.push({
      severity: "medium",
      message: "Tutorial lacks visible expected results or verification cues.",
      evidence: [],
      recommendation: "Add expected outputs after important learner actions."
    });
  }

  if (mode === "how-to" && metrics.orderedStepCount < 2) {
    findings.push({
      severity: "medium",
      message: "How-to guide has few ordered task steps.",
      evidence: [`${metrics.orderedStepCount} ordered steps detected`],
      recommendation: "Make the practical task sequence explicit."
    });
  }

  if (mode === "reference" && metrics.tableLineCount < 3 && metrics.optionLikeLineCount < 3) {
    findings.push({
      severity: "low",
      message: "Reference page may not be structured enough for lookup.",
      evidence: [`${metrics.tableLineCount} table lines, ${metrics.optionLikeLineCount} option-like lines`],
      recommendation: "Use stable headings, tables, lists, and field descriptions."
    });
  }

  if (mode === "explanation" && metrics.orderedStepCount >= 3) {
    findings.push({
      severity: "medium",
      message: "Explanation contains substantial procedural material.",
      evidence: [`${metrics.orderedStepCount} ordered steps detected`],
      recommendation: "Move task steps into a how-to guide and link to it."
    });
  }

  if (modeConfusions.some((confusion) => confusion.severity === "high")) {
    findings.push({
      severity: "high",
      message: "Page has strong mixed-mode signals.",
      evidence: modeConfusions.map((confusion) => `${confusion.confusedWith}: ${confusion.recommendation}`),
      recommendation: "Choose one primary mode and extract the strongest secondary mode content."
    });
  } else if (extractionTargets.length > 0) {
    findings.push({
      severity: "medium",
      message: "Page has extractable secondary-mode content.",
      evidence: extractionTargets.map((target) => `${target.mode}: ${target.reason}`),
      recommendation: "Extract secondary material incrementally and leave links from the primary page."
    });
  }

  return findings;
}

function buildNextActions(mode: DiataxisMode, findings: AuditFinding[], extractionTargets: ExtractionTarget[]): string[] {
  const actions = [`Keep the page focused on ${modeNeeds[mode]}.`];

  for (const target of extractionTargets.slice(0, 2)) {
    actions.push(`Extract ${target.mode} material into "${target.suggestedTitle}".`);
  }

  for (const finding of findings.slice(0, 2)) {
    actions.push(finding.recommendation);
  }

  return Array.from(new Set(actions)).slice(0, 5);
}

function recommendationForConfusion(primary: DiataxisMode, secondary: DiataxisMode): string {
  if (secondary === "reference") {
    return "Move exact options, defaults, schemas, and API details to reference.";
  }
  if (secondary === "explanation") {
    return "Move conceptual background, rationale, and trade-offs to explanation.";
  }
  if (secondary === "how-to") {
    return "Move real-world task steps to a how-to guide.";
  }
  if (secondary === "tutorial") {
    return "Move beginner lesson material to a tutorial.";
  }

  return `Keep ${primary} content primary and link to ${secondary} material.`;
}

function suggestedExtractionTitle(title: string, mode: DiataxisMode): string {
  const suffix: Record<DiataxisMode, string> = {
    tutorial: "tutorial",
    "how-to": "how-to guide",
    reference: "reference",
    explanation: "explained"
  };

  return `${title}: ${suffix[mode]}`;
}
