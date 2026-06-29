import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { auditDocPage } from "../src/core/audit-page.js";

function fixture(name: string): string {
  return readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
}

describe("auditDocPage", () => {
  it("detects extractable reference material in a task guide", () => {
    const content = fixture("mixed-page.md");
    const result = auditDocPage({
      path: "docs/how-to/deploy-with-docker.md",
      content
    });

    expect(result.classification.mode).toBe("how-to");
    expect(result.extractionTargets.some((target) => target.mode === "reference")).toBe(true);
    expect(result.nextActions.length).toBeGreaterThan(0);
  });

  it("audits a tutorial without flagging missing expected results", () => {
    const content = fixture("tutorial.md");
    const result = auditDocPage({
      path: "docs/tutorials/get-started.md",
      content
    });

    expect(result.classification.mode).toBe("tutorial");
    expect(result.findings.some((finding) => finding.message.includes("expected results"))).toBe(false);
  });

  it("keeps a reference page with examples classified as reference", () => {
    const result = auditDocPage({
      path: "docs/reference/widget-api.md",
      content: fixture("reference-with-examples.md")
    });

    expect(result.classification.mode).toBe("reference");
    expect(result.extractionTargets.some((target) => target.mode === "how-to")).toBe(false);
  });

  it("keeps an explanation page with bullet lists classified as explanation", () => {
    const result = auditDocPage({
      path: "docs/explanation/scheduler-architecture.md",
      content: fixture("explanation-with-bullets.md")
    });

    expect(result.classification.mode).toBe("explanation");
    expect(result.findings.some((finding) => finding.message.includes("procedural"))).toBe(false);
  });

  it("extracts conceptual background from a how-to guide", () => {
    const result = auditDocPage({
      path: "docs/how-to/configure-cache-storage.md",
      content: fixture("how-to-with-background.md")
    });

    expect(result.classification.mode).toBe("how-to");
    expect(result.extractionTargets.some((target) => target.mode === "explanation")).toBe(true);
  });

  it("accepts tutorial expected output shown in code fences", () => {
    const result = auditDocPage({
      path: "docs/tutorials/build-your-first-widget.md",
      content: fixture("tutorial-code-output.md")
    });

    expect(result.classification.mode).toBe("tutorial");
    expect(result.findings.some((finding) => finding.message.includes("expected results"))).toBe(false);
  });

  it("flags extraction targets for an ambiguous mixed-mode page", () => {
    const result = auditDocPage({
      path: "docs/tutorials/getting-started-and-reference.md",
      content: fixture("ambiguous-mixed-mode.md")
    });

    expect(result.extractionTargets.length).toBeGreaterThan(0);
    expect(result.modeConfusions.length).toBeGreaterThan(0);
  });
});
