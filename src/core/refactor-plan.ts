import {
  type DiataxisMode,
  type SuggestDocRefactorResult,
  suggestDocRefactorInputSchema,
  suggestDocRefactorResultSchema
} from "../types/index.js";
import { auditDocTree } from "./audit-tree.js";
import { slugifyPathSegment } from "./path-utils.js";

export function suggestDocRefactor(input: unknown): SuggestDocRefactorResult {
  const parsed = suggestDocRefactorInputSchema.parse(input);
  const audit = auditDocTree({ pages: parsed.pages });
  const actions = audit.pages.flatMap((page) => {
    const extractionActions = page.extractionTargets.map((target) => ({
      priority: "medium" as const,
      operation: "extract" as const,
      pageTitle: page.page.title,
      ...(page.page.path ? { pagePath: page.page.path } : {}),
      ...(page.page.path ? { sourcePath: page.page.path } : {}),
      targetPath: targetPathFor(target.mode, target.suggestedTitle),
      targetTitle: target.suggestedTitle,
      action: `Extract ${target.mode} material into "${target.suggestedTitle}".`,
      targetMode: target.mode,
      reason: target.reason
    }));

    const highFindings = page.findings
      .filter((finding) => finding.severity === "high")
      .map((finding) => ({
        priority: "high" as const,
        operation: "review" as const,
        pageTitle: page.page.title,
        ...(page.page.path ? { pagePath: page.page.path } : {}),
        ...(page.page.path ? { sourcePath: page.page.path } : {}),
        action: finding.recommendation,
        targetMode: page.classification.mode,
        reason: finding.message
      }));

    return [...highFindings, ...extractionActions];
  });

  return suggestDocRefactorResultSchema.parse({
    ...(parsed.objective ? { objective: parsed.objective } : {}),
    actions,
    sequence: [
      "Confirm the primary mode for each page.",
      "Apply high-priority mode corrections first.",
      "Extract secondary material into new pages.",
      "Replace extracted sections with links."
    ]
  });
}

function targetPathFor(mode: DiataxisMode, title: string): string {
  const directories: Record<DiataxisMode, string> = {
    tutorial: "docs/tutorials",
    "how-to": "docs/how-to",
    reference: "docs/reference",
    explanation: "docs/explanation"
  };

  return `${directories[mode]}/${slugifyPathSegment(title)}.md`;
}
