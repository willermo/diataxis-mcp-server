import { describe, expect, it } from "vitest";
import { createServer } from "../src/mcp/server.js";

describe("MCP server registration", () => {
  it("creates the server without starting stdio", () => {
    const server = createServer();

    expect(server.isConnected()).toBe(false);
  });

  it("registers expected tools, resources, and prompts", () => {
    // This smoke test uses SDK internals for now; replace it with a protocol-level test when the client harness is stable.
    const server = createServer() as unknown as Record<string, Record<string, unknown>>;

    expect(Object.keys(server._registeredTools ?? {})).toEqual(
      expect.arrayContaining([
        "classify_doc_request",
        "audit_doc_page",
        "audit_doc_tree",
        "suggest_doc_refactor",
        "plan_doc_set"
      ])
    );
    expect(Object.keys(server._registeredResources ?? {})).toEqual(
      expect.arrayContaining([
        "diataxis://checklists/tutorial",
        "diataxis://rubrics/classification",
        "diataxis://workflow/audit-existing-docs"
      ])
    );
    expect(Object.keys(server._registeredPrompts ?? {})).toEqual(
      expect.arrayContaining(["audit_existing_docs", "create_docs_from_scratch"])
    );
  });
});
