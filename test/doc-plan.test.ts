import { describe, expect, it } from "vitest";
import { planDocSet } from "../src/core/doc-plan.js";

describe("planDocSet", () => {
  it("creates pages across the four Diataxis modes", () => {
    const result = planDocSet({
      projectName: "Widget Server",
      projectSummary: "A TypeScript MCP server with configuration and API tools.",
      userGoals: ["configure an MCP client"],
      publicInterfaces: ["MCP tools", "configuration"]
    });

    const modes = new Set(result.recommendedPages.map((page) => page.mode));
    expect(modes).toEqual(new Set(["tutorial", "how-to", "reference", "explanation"]));
  });
});
