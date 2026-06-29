import type {
  ClassificationEvidence,
  DiataxisMode,
  DimensionScores,
  ModeScores
} from "../types/index.js";

export type ClassificationSignal = {
  mode: DiataxisMode;
  signal: string;
  weight: number;
  patterns: RegExp[];
  dimensions?: Partial<DimensionScores>;
};

export type MarkdownMetrics = {
  headingCount: number;
  orderedStepCount: number;
  unorderedListCount: number;
  tableLineCount: number;
  fencedCodeBlockCount: number;
  commandLineCount: number;
  optionLikeLineCount: number;
  expectedResultCount: number;
};

export const modeNeeds: Record<DiataxisMode, string> = {
  tutorial: "learning through a guided lesson",
  "how-to": "accomplishing a practical task",
  reference: "looking up exact facts while working",
  explanation: "understanding concepts, context, and reasons"
};

export const suggestedStructures: Record<DiataxisMode, string[]> = {
  tutorial: [
    "Learning goal",
    "Prerequisites",
    "Guided steps",
    "Expected results",
    "Recap and next practice"
  ],
  "how-to": [
    "Task goal",
    "Prerequisites",
    "Procedure",
    "Verification",
    "Related reference"
  ],
  reference: [
    "Scope",
    "Syntax or schema",
    "Parameters and defaults",
    "Return values or outputs",
    "Errors and constraints"
  ],
  explanation: [
    "Concept",
    "Context",
    "Rationale",
    "Trade-offs",
    "Related tasks and reference"
  ]
};

export const classificationSignals: ClassificationSignal[] = [
  {
    mode: "tutorial",
    signal: "guided lesson wording",
    weight: 4,
    patterns: [/in this tutorial/i, /guided lesson/i, /walkthrough/i, /your first/i],
    dimensions: { action: 2, skillAcquisition: 3 }
  },
  {
    mode: "tutorial",
    signal: "learner audience",
    weight: 3,
    patterns: [/beginner/i, /first[- ]time/i, /new to/i, /learn(?:ing)?\b/i, /getting started/i],
    dimensions: { skillAcquisition: 3 }
  },
  {
    mode: "tutorial",
    signal: "visible outcome language",
    weight: 2,
    patterns: [/you should see/i, /notice that/i, /let'?s check/i, /expected output/i],
    dimensions: { action: 1, skillAcquisition: 2 }
  },
  {
    mode: "how-to",
    signal: "task guide wording",
    weight: 4,
    patterns: [/\bhow to\b/i, /this guide shows/i, /to achieve\b/i, /practical task/i],
    dimensions: { action: 3, skillApplication: 2 }
  },
  {
    mode: "how-to",
    signal: "operational task verb",
    weight: 3,
    patterns: [
      /\bconfigure\b/i,
      /\bdeploy\b/i,
      /\bmigrate\b/i,
      /\btroubleshoot\b/i,
      /\bset up\b/i,
      /\bupgrade\b/i,
      /\binstall\b/i,
      /\bconnect\b/i
    ],
    dimensions: { action: 2, skillApplication: 2 }
  },
  {
    mode: "how-to",
    signal: "real-world variation",
    weight: 2,
    patterns: [/if you need/i, /in this case/i, /for production/i, /when using/i],
    dimensions: { action: 1, skillApplication: 2 }
  },
  {
    mode: "reference",
    signal: "reference title or scope",
    weight: 4,
    patterns: [/\breference\b/i, /\bapi\b/i, /\bcli\b/i, /\bschema\b/i, /\bconfiguration\b/i],
    dimensions: { cognition: 2, skillApplication: 3 }
  },
  {
    mode: "reference",
    signal: "exact machinery details",
    weight: 3,
    patterns: [
      /\bparameters?\b/i,
      /\boptions?\b/i,
      /\bflags?\b/i,
      /\barguments?\b/i,
      /\breturns?\b/i,
      /\bdefault\b/i,
      /\ballowed values\b/i,
      /\benvironment variables?\b/i,
      /\berror codes?\b/i
    ],
    dimensions: { cognition: 2, skillApplication: 2 }
  },
  {
    mode: "reference",
    signal: "neutral fact pattern",
    weight: 2,
    patterns: [/accepts the following/i, /has the following fields/i, /valid values/i, /type:\s*\w+/i],
    dimensions: { cognition: 2, skillApplication: 1 }
  },
  {
    mode: "explanation",
    signal: "conceptual title or scope",
    weight: 4,
    patterns: [/\bwhy\b/i, /\bconcepts?\b/i, /\barchitecture\b/i, /\brationale\b/i, /\bdesign\b/i],
    dimensions: { cognition: 3, skillAcquisition: 2 }
  },
  {
    mode: "explanation",
    signal: "reasoning and context",
    weight: 3,
    patterns: [/\bbecause\b/i, /\btrade[- ]offs?\b/i, /\bbackground\b/i, /\bmental model\b/i, /\bunderstand\b/i],
    dimensions: { cognition: 2, skillAcquisition: 2 }
  },
  {
    mode: "explanation",
    signal: "comparison language",
    weight: 2,
    patterns: [/\bcompared with\b/i, /\balternative/i, /\bhistorically\b/i, /\bfavors .+ over\b/i],
    dimensions: { cognition: 2, skillAcquisition: 1 }
  }
];

export function blankModeScores(): ModeScores {
  return {
    tutorial: 0,
    "how-to": 0,
    reference: 0,
    explanation: 0
  };
}

export function blankDimensionScores(): DimensionScores {
  return {
    action: 0,
    cognition: 0,
    skillAcquisition: 0,
    skillApplication: 0
  };
}

export function modeByScore(scores: ModeScores): DiataxisMode {
  return rankedModes(scores)[0]?.mode ?? "how-to";
}

export function rankedModes(scores: ModeScores): Array<{ mode: DiataxisMode; score: number }> {
  return (Object.entries(scores) as Array<[DiataxisMode, number]>)
    .map(([mode, score]) => ({ mode, score }))
    .sort((a, b) => b.score - a.score);
}

export function analyzeMarkdown(content: string): MarkdownMetrics {
  const lines = content.split(/\r?\n/);
  const fencedCodeBlockCount = (content.match(/```/g)?.length ?? 0) / 2;

  return {
    headingCount: lines.filter((line) => /^#{1,6}\s+\S/.test(line)).length,
    orderedStepCount: lines.filter((line) => /^\s*\d+\.\s+\S/.test(line)).length,
    unorderedListCount: lines.filter((line) => /^\s*[-*]\s+\S/.test(line)).length,
    tableLineCount: lines.filter((line) => /^\s*\|.+\|\s*$/.test(line)).length,
    fencedCodeBlockCount: Math.floor(fencedCodeBlockCount),
    commandLineCount: lines.filter((line) =>
      /^\s*(?:npm|pnpm|yarn|git|curl|docker|kubectl|node|npx|python|pip|go|cargo)\b/.test(line)
    ).length,
    optionLikeLineCount: lines.filter((line) =>
      /(?:--[a-z][\w-]*|`[A-Z][A-Z0-9_]+`|\bDefault:|\bAllowed values:|\bReturns:)/.test(line)
    ).length,
    expectedResultCount: lines.filter((line) => /you should see|expected|verify|check that|result/i.test(line)).length
  };
}

export function excerptAround(text: string, matchIndex: number, length = 120): string {
  const start = Math.max(0, matchIndex - 45);
  const end = Math.min(text.length, matchIndex + length);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

export function addEvidence(
  evidence: ClassificationEvidence[],
  mode: DiataxisMode,
  signal: string,
  weight: number,
  excerpt: string
): void {
  evidence.push({
    mode,
    signal,
    weight: round(weight),
    excerpt
  });
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}
