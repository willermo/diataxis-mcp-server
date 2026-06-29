import type { DiataxisMode } from "../types/index.js";

export type Checklist = {
  title: string;
  purpose: string;
  keep: string[];
  avoid: string[];
};

export const checklists: Record<DiataxisMode, Checklist> = {
  tutorial: {
    title: "Tutorial checklist",
    purpose: "Help a learner acquire skill through a guided lesson.",
    keep: [
      "One safe path from start to finish",
      "Concrete actions with visible results",
      "Expected output or verification after important steps",
      "Minimal branching and minimal theory"
    ],
    avoid: [
      "Production-grade alternatives",
      "Long conceptual digressions",
      "Exhaustive option tables"
    ]
  },
  "how-to": {
    title: "How-to guide checklist",
    purpose: "Help a competent user complete a practical task.",
    keep: [
      "A clear real-world goal",
      "Actionable sequence of steps",
      "Only necessary choices and variations",
      "Links to reference or explanation for depth"
    ],
    avoid: [
      "Beginner lessons",
      "Long background sections",
      "Complete API or configuration catalogs"
    ]
  },
  reference: {
    title: "Reference checklist",
    purpose: "Describe machinery accurately for users who are working.",
    keep: [
      "Stable structure that mirrors the product or API",
      "Names, defaults, constraints, parameters, and return values",
      "Neutral wording",
      "Consistent tables, lists, and examples"
    ],
    avoid: [
      "Task walkthroughs",
      "Design rationale essays",
      "Persuasive or subjective guidance"
    ]
  },
  explanation: {
    title: "Explanation checklist",
    purpose: "Help a user understand concepts, context, and reasons.",
    keep: [
      "A bounded conceptual topic",
      "Context, relationships, and rationale",
      "Alternatives and trade-offs where useful",
      "Links to task guides and reference"
    ],
    avoid: [
      "Step-by-step procedures",
      "Command flag catalogs",
      "Exhaustive API details"
    ]
  }
};

export function checklistToMarkdown(mode: DiataxisMode): string {
  const checklist = checklists[mode];
  return [
    `# ${checklist.title}`,
    "",
    checklist.purpose,
    "",
    "## Keep",
    ...checklist.keep.map((item) => `- ${item}`),
    "",
    "## Avoid",
    ...checklist.avoid.map((item) => `- ${item}`)
  ].join("\n");
}
