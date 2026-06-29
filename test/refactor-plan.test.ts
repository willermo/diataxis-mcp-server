import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { suggestDocRefactor } from "../src/core/refactor-plan.js";

function fixture(name: string): string {
  return readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
}

describe("suggestDocRefactor", () => {
  it("turns audit extraction targets into incremental refactor actions", () => {
    const result = suggestDocRefactor({
      objective: "Separate mixed Diataxis modes before expanding the docs.",
      pages: [
        { path: "docs/how-to/configure-cache-storage.md", content: fixture("how-to-with-background.md") },
        { path: "docs/tutorials/getting-started-and-reference.md", content: fixture("ambiguous-mixed-mode.md") }
      ]
    });

    expect(result.objective).toContain("Separate mixed");
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.actions.some((action) => action.targetMode === "explanation")).toBe(true);
    expect(result.actions.some((action) => action.operation === "extract")).toBe(true);
    expect(result.actions.some((action) => action.sourcePath === "docs/how-to/configure-cache-storage.md")).toBe(true);
    expect(result.actions.some((action) => action.targetPath?.startsWith("docs/explanation/"))).toBe(true);
    expect(result.actions.some((action) => action.targetTitle?.includes("explained"))).toBe(true);
    expect(result.sequence).toContain("Extract secondary material into new pages.");
  });

  it("uses normalized accented titles in suggested target paths", () => {
    const result = suggestDocRefactor({
      pages: [
        {
          path: "references/diataxis/diataxis-operational-summary.md",
          content: fixture("ambiguous-mixed-mode.md").replace(
            "# Getting started and API reference",
            "# Diátaxis Operational Summary for Agents"
          )
        }
      ]
    });

    expect(result.actions.some((action) => action.targetPath?.includes("diataxis-operational-summary-for-agents"))).toBe(
      true
    );
    expect(result.actions.some((action) => action.targetPath?.includes("di-taxis"))).toBe(false);
  });

  it("adds review operation metadata for high-priority findings", () => {
    const result = suggestDocRefactor({
      pages: [
        {
          path: "docs/tutorials/widget-api.md",
          declaredMode: "tutorial",
          content: fixture("reference-with-examples.md")
        }
      ]
    });

    expect(result.actions).toContainEqual(
      expect.objectContaining({
        priority: "high",
        operation: "review",
        sourcePath: "docs/tutorials/widget-api.md",
        targetMode: "reference"
      })
    );
  });
});
