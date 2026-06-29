import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { auditDocTree } from "../src/core/audit-tree.js";

function fixture(name: string): string {
  return readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
}

describe("auditDocTree", () => {
  it("summarizes mode counts and mixed-mode pages", () => {
    const result = auditDocTree({
      pages: [
        { path: "docs/tutorials/build.md", content: fixture("tutorial-code-output.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") },
        { path: "docs/explanation/scheduler.md", content: fixture("explanation-with-bullets.md") },
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") }
      ]
    });

    expect(result.scope).toBe("full-docs");
    expect(result.summary.totalPages).toBe(4);
    expect(result.summary.modeCounts.tutorial).toBe(1);
    expect(result.summary.modeCounts.reference).toBe(1);
    expect(result.summary.modeCounts.explanation).toBe(1);
    expect(result.summary.modeCounts["how-to"]).toBe(1);
    expect(result.summary.pagesWithConfusion).toBeGreaterThan(0);
    expect(result.nextActions.some((action) => action.includes("mixed-mode"))).toBe(true);
  });

  it("reports missing modes and coverage warnings", () => {
    const result = auditDocTree({
      pages: [
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });

    expect(result.missingModes).toEqual(["tutorial", "explanation"]);
    expect(result.coverageWarnings.some((warning) => warning.includes("Missing Diataxis modes"))).toBe(true);
    expect(result.nextActions.some((action) => action.includes("tutorial, explanation"))).toBe(true);
  });

  it("uses cautious coverage wording for section audits", () => {
    const result = auditDocTree({
      scope: "section",
      pages: [
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });

    expect(result.scope).toBe("section");
    expect(result.missingModes).toEqual(["tutorial", "explanation"]);
    expect(result.coverageWarnings).toContain("This section does not include tutorial, explanation pages.");
    expect(result.nextActions).toContain("Consider whether this section needs tutorial, explanation coverage.");
  });

  it("uses advisory coverage wording for sample audits", () => {
    const result = auditDocTree({
      scope: "sample",
      pages: [
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });

    expect(result.scope).toBe("sample");
    expect(result.missingModes).toEqual(["tutorial", "explanation"]);
    expect(result.coverageWarnings).toContain(
      "This sample does not include tutorial, explanation pages; do not treat this as full documentation coverage."
    );
    expect(result.nextActions).toContain(
      "Treat missing tutorial, explanation coverage as sample-only unless a full-docs audit confirms it."
    );
  });

  it("reports dominant modes when one mode is over half the tree", () => {
    const result = auditDocTree({
      pages: [
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") },
        { path: "docs/how-to/deploy.md", content: fixture("mixed-page.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });

    expect(result.dominantModes).toEqual(["how-to"]);
    expect(result.coverageWarnings.some((warning) => warning.includes("dominated by: how-to"))).toBe(true);
  });

  it("uses scope-aware dominant mode warnings", () => {
    const sectionResult = auditDocTree({
      scope: "section",
      pages: [
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") },
        { path: "docs/how-to/deploy.md", content: fixture("mixed-page.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });
    const sampleResult = auditDocTree({
      scope: "sample",
      pages: [
        { path: "docs/how-to/cache.md", content: fixture("how-to-with-background.md") },
        { path: "docs/how-to/deploy.md", content: fixture("mixed-page.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });

    expect(sectionResult.coverageWarnings).toContain("This section is dominated by how-to pages.");
    expect(sampleResult.coverageWarnings).toContain(
      "This sample is dominated by how-to pages; do not treat this as full documentation architecture."
    );
  });

  it("groups suggested navigation by detected Diataxis mode", () => {
    const result = auditDocTree({
      pages: [
        { path: "docs/tutorials/build.md", content: fixture("tutorial-code-output.md") },
        { path: "docs/reference/widget-api.md", content: fixture("reference-with-examples.md") }
      ]
    });

    const tutorialGroup = result.suggestedNavigation.find((group) => group.mode === "tutorial");
    const referenceGroup = result.suggestedNavigation.find((group) => group.mode === "reference");
    const howToGroup = result.suggestedNavigation.find((group) => group.mode === "how-to");

    expect(tutorialGroup?.pages).toEqual([
      {
        title: "Build your first widget",
        path: "docs/tutorials/build.md",
        confidence: expect.any(Number)
      }
    ]);
    expect(referenceGroup?.pages[0]?.path).toBe("docs/reference/widget-api.md");
    expect(howToGroup?.pages).toEqual([]);
  });
});
