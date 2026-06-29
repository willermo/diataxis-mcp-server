import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "audit_existing_docs",
    {
      title: "Audit existing documentation",
      description: "Guide an agent through auditing docs with the Diataxis tools.",
      argsSchema: {
        scope: z.string().optional()
      }
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `Audit the documentation${args.scope ? ` in ${args.scope}` : ""} using Diataxis.`,
              "Classify each page, identify mixed-mode content, and propose incremental refactors."
            ].join("\n")
          }
        }
      ]
    })
  );

  server.registerPrompt(
    "create_docs_from_scratch",
    {
      title: "Create docs from scratch",
      description: "Guide an agent through planning a new Diataxis documentation set.",
      argsSchema: {
        project: z.string()
      }
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `Plan an initial Diataxis documentation set for ${args.project}.`,
              "Use tutorial, how-to, reference, and explanation pages for distinct user needs."
            ].join("\n")
          }
        }
      ]
    })
  );
}
