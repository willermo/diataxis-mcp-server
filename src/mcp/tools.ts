import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { auditDocPage } from "../core/audit-page.js";
import { auditDocTree } from "../core/audit-tree.js";
import { classifyDocRequest } from "../core/classify.js";
import { planDocSet } from "../core/doc-plan.js";
import { suggestDocRefactor } from "../core/refactor-plan.js";
import {
  auditDocPageInputSchema,
  auditDocPageResultSchema,
  auditDocTreeInputSchema,
  auditDocTreeResultSchema,
  classifyDocRequestInputSchema,
  classificationResultSchema,
  planDocSetInputSchema,
  planDocSetResultSchema,
  suggestDocRefactorInputSchema,
  suggestDocRefactorResultSchema
} from "../types/index.js";

export function registerTools(server: McpServer): void {
  server.registerTool(
    "classify_doc_request",
    {
      title: "Classify documentation request",
      description: "Classify a documentation request or page draft into a Diataxis mode.",
      inputSchema: classifyDocRequestInputSchema,
      outputSchema: classificationResultSchema
    },
    (args) => jsonResult(classificationResultSchema, classifyDocRequest(args))
  );

  server.registerTool(
    "audit_doc_page",
    {
      title: "Audit documentation page",
      description: "Audit a Markdown page for Diataxis mode, mixed-mode signals, and refactoring actions.",
      inputSchema: auditDocPageInputSchema,
      outputSchema: auditDocPageResultSchema
    },
    (args) => jsonResult(auditDocPageResultSchema, auditDocPage(args))
  );

  server.registerTool(
    "audit_doc_tree",
    {
      title: "Audit documentation tree",
      description:
        "Audit multiple documentation pages and summarize mode distribution, confusion, and coverage. Use scope=full-docs|section|sample to control how coverage warnings are interpreted.",
      inputSchema: auditDocTreeInputSchema,
      outputSchema: auditDocTreeResultSchema
    },
    (args) => jsonResult(auditDocTreeResultSchema, auditDocTree(args))
  );

  server.registerTool(
    "suggest_doc_refactor",
    {
      title: "Suggest documentation refactor",
      description: "Create an incremental refactoring sequence from documentation page audits.",
      inputSchema: suggestDocRefactorInputSchema,
      outputSchema: suggestDocRefactorResultSchema
    },
    (args) => jsonResult(suggestDocRefactorResultSchema, suggestDocRefactor(args))
  );

  server.registerTool(
    "plan_doc_set",
    {
      title: "Plan documentation set",
      description: "Suggest an initial Diataxis-aligned documentation set from a project summary.",
      inputSchema: planDocSetInputSchema,
      outputSchema: planDocSetResultSchema
    },
    (args) => jsonResult(planDocSetResultSchema, planDocSet(args))
  );
}

function jsonResult<T>(schema: z.ZodType<T>, value: unknown): CallToolResult {
  const structuredContent = schema.parse(value) as { [key: string]: unknown };
  return {
    structuredContent,
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2)
      }
    ]
  };
}
