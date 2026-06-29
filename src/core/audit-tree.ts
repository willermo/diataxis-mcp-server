import {
  type AuditDocTreeResult,
  auditDocTreeInputSchema,
  auditDocTreeResultSchema,
  type AuditScope,
  diataxisModes,
  type DiataxisMode
} from "../types/index.js";
import { auditDocPage } from "./audit-page.js";
import { blankModeScores, round } from "./rubrics.js";

export function auditDocTree(input: unknown): AuditDocTreeResult {
  const parsed = auditDocTreeInputSchema.parse(input);
  const pages = parsed.pages.map((page) => auditDocPage(page));
  const modeCounts = blankModeScores();

  for (const page of pages) {
    modeCounts[page.classification.mode as DiataxisMode] += 1;
  }

  const averageConfidence =
    pages.length === 0 ? 0 : round(pages.reduce((total, page) => total + page.classification.confidence, 0) / pages.length);
  const pagesWithConfusion = pages.filter((page) => page.modeConfusions.length > 0).length;
  const missingModes = diataxisModes.filter((mode) => modeCounts[mode] === 0);
  const dominantModes = findDominantModes(modeCounts, pages.length);
  const suggestedNavigation = diataxisModes.map((mode) => ({
    mode,
    pages: pages
      .filter((page) => page.classification.mode === mode)
      .map((page) => ({
        title: page.page.title,
        ...(page.page.path ? { path: page.page.path } : {}),
        confidence: page.classification.confidence
      }))
  }));
  const coverageWarnings = buildCoverageWarnings(parsed.scope, missingModes, dominantModes, pagesWithConfusion);

  return auditDocTreeResultSchema.parse({
    scope: parsed.scope,
    pages,
    summary: {
      totalPages: pages.length,
      modeCounts,
      averageConfidence,
      pagesWithConfusion
    },
    missingModes,
    dominantModes,
    coverageWarnings,
    suggestedNavigation,
    nextActions: buildTreeActions(parsed.scope, pagesWithConfusion, missingModes)
  });
}

function findDominantModes(modeCounts: Record<DiataxisMode, number>, totalPages: number): DiataxisMode[] {
  if (totalPages === 0) {
    return [];
  }

  const maxCount = Math.max(...diataxisModes.map((mode) => modeCounts[mode]));
  if (maxCount / totalPages <= 0.5) {
    return [];
  }

  return diataxisModes.filter((mode) => modeCounts[mode] === maxCount);
}

function buildCoverageWarnings(
  scope: AuditScope,
  missingModes: DiataxisMode[],
  dominantModes: DiataxisMode[],
  pagesWithConfusion: number
): string[] {
  const warnings: string[] = [];

  if (missingModes.length > 0) {
    warnings.push(missingModesWarning(scope, missingModes));
  }

  if (dominantModes.length > 0) {
    warnings.push(dominantModesWarning(scope, dominantModes));
  }

  if (pagesWithConfusion > 0) {
    warnings.push(mixedModeWarning(scope, pagesWithConfusion));
  }

  return warnings;
}

function missingModesWarning(scope: AuditScope, missingModes: DiataxisMode[]): string {
  const modes = missingModes.join(", ");

  if (scope === "section") {
    return `This section does not include ${modes} pages.`;
  }

  if (scope === "sample") {
    return `This sample does not include ${modes} pages; do not treat this as full documentation coverage.`;
  }

  return `Missing Diataxis modes: ${modes}.`;
}

function dominantModesWarning(scope: AuditScope, dominantModes: DiataxisMode[]): string {
  const modes = dominantModes.join(", ");

  if (scope === "section") {
    return `This section is dominated by ${modes} pages.`;
  }

  if (scope === "sample") {
    return `This sample is dominated by ${modes} pages; do not treat this as full documentation architecture.`;
  }

  return `Documentation set is dominated by: ${modes}.`;
}

function mixedModeWarning(scope: AuditScope, pagesWithConfusion: number): string {
  if (scope === "section") {
    return `${pagesWithConfusion} page(s) in this section have mixed-mode signals.`;
  }

  if (scope === "sample") {
    return `${pagesWithConfusion} page(s) in this sample have mixed-mode signals.`;
  }

  return `${pagesWithConfusion} page(s) have mixed-mode signals.`;
}

function buildTreeActions(scope: AuditScope, pagesWithConfusion: number, missingModes: DiataxisMode[]): string[] {
  const actions =
    scope === "full-docs"
      ? [
          "Review low-confidence classifications before moving files.",
          "Group pages by primary Diataxis mode in the documentation navigation."
        ]
      : [
          `Review low-confidence classifications within this ${scope === "section" ? "section" : "sample"}.`,
          `Group audited pages by primary Diataxis mode for this ${scope === "section" ? "section" : "sample"}.`
        ];

  if (pagesWithConfusion > 0) {
    actions.unshift(mixedModeAction(scope, pagesWithConfusion));
  }

  if (missingModes.length > 0) {
    actions.push(missingModesAction(scope, missingModes));
  }

  return actions;
}

function mixedModeAction(scope: AuditScope, pagesWithConfusion: number): string {
  if (scope === "section") {
    return `Review ${pagesWithConfusion} section page(s) with mixed-mode signals.`;
  }

  if (scope === "sample") {
    return `Review ${pagesWithConfusion} sampled page(s) with mixed-mode signals before applying any refactor.`;
  }

  return `Prioritize ${pagesWithConfusion} page(s) with mixed-mode signals.`;
}

function missingModesAction(scope: AuditScope, missingModes: DiataxisMode[]): string {
  const modes = missingModes.join(", ");

  if (scope === "section") {
    return `Consider whether this section needs ${modes} coverage.`;
  }

  if (scope === "sample") {
    return `Treat missing ${modes} coverage as sample-only unless a full-docs audit confirms it.`;
  }

  return `Consider whether the docs need ${modes} coverage.`;
}
