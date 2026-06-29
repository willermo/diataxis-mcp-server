import { describe, expect, it } from "vitest";
import { classifyDocRequest } from "../src/core/classify.js";

describe("classifyDocRequest", () => {
  it("classifies beginner lessons as tutorials", () => {
    const result = classifyDocRequest({
      title: "Getting started with Widget CLI",
      request: "Create a beginner tutorial for first-time users that shows expected output."
    });

    expect(result.mode).toBe("tutorial");
    expect(result.confidence).toBeGreaterThan(0.45);
  });

  it("classifies practical task requests as how-to guides", () => {
    const result = classifyDocRequest({
      title: "Configure SSO",
      request: "Write a guide that shows how to configure SSO for production."
    });

    expect(result.mode).toBe("how-to");
    expect(result.scores["how-to"]).toBeGreaterThan(result.scores.reference);
  });

  it("classifies lookup material as reference", () => {
    const result = classifyDocRequest({
      title: "CLI reference",
      request: "Document every command, flag, default, parameter, and allowed value."
    });

    expect(result.mode).toBe("reference");
  });

  it("classifies conceptual material as explanation", () => {
    const result = classifyDocRequest({
      title: "Why the scheduler works this way",
      request: "Explain the architecture, rationale, alternatives, and trade-offs."
    });

    expect(result.mode).toBe("explanation");
  });

  it("warns when declared mode conflicts with detected mode", () => {
    const result = classifyDocRequest({
      title: "API reference",
      request: "Document parameters, defaults, return values, and error codes.",
      declaredMode: "tutorial"
    });

    expect(result.mode).toBe("reference");
    expect(result.warnings.some((warning) => warning.includes("Declared mode"))).toBe(true);
  });

  it("surfaces possible mode confusion for ambiguous mixed-mode content", () => {
    const result = classifyDocRequest({
      title: "Getting started and API reference",
      request: "Classify this mixed documentation page.",
      existingContent: [
        "In this tutorial, you deploy the service.",
        "1. Install the CLI.",
        "2. Deploy the service.",
        "3. Verify the endpoint.",
        "",
        "| Option | Default | Description |",
        "| --- | --- | --- |",
        "| `REGION` | `us-east-1` | Deployment region |",
        "",
        "The design favors rollback safety because recovery matters."
      ].join("\n")
    });

    expect(result.warnings.some((warning) => warning.includes("secondary"))).toBe(true);
    expect(result.evidence.length).toBeGreaterThan(1);
  });
});
