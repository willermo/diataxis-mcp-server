import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { checklistToMarkdown } from "../content/checklists.js";
import { classificationRubricMarkdown, workflowMarkdown } from "../content/diataxis-summary.js";
import type { DiataxisMode } from "../types/index.js";

type StaticResource = {
  name: string;
  uri: string;
  title: string;
  description: string;
  text: string;
};

const checklistResources: Array<{ uriPart: string; mode: DiataxisMode }> = [
  { uriPart: "tutorial", mode: "tutorial" },
  { uriPart: "how-to", mode: "how-to" },
  { uriPart: "reference", mode: "reference" },
  { uriPart: "explanation", mode: "explanation" }
];

export function registerResources(server: McpServer): void {
  for (const resource of allResources()) {
    server.registerResource(
      resource.name,
      resource.uri,
      {
        title: resource.title,
        description: resource.description,
        mimeType: "text/markdown"
      },
      (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: resource.text
          }
        ]
      })
    );
  }
}

function allResources(): StaticResource[] {
  return [
    ...checklistResources.map(({ uriPart, mode }) => ({
      name: `diataxis-checklist-${uriPart}`,
      uri: `diataxis://checklists/${uriPart}`,
      title: `${mode} checklist`,
      description: `Short operational checklist for ${mode} pages.`,
      text: checklistToMarkdown(mode)
    })),
    {
      name: "diataxis-classification-rubric",
      uri: "diataxis://rubrics/classification",
      title: "Classification rubric",
      description: "Short rubric for classifying documentation by user need.",
      text: classificationRubricMarkdown
    },
    {
      name: "diataxis-workflow-audit-existing-docs",
      uri: "diataxis://workflow/audit-existing-docs",
      title: "Audit existing docs workflow",
      description: "Workflow for auditing and refactoring existing documentation.",
      text: workflowMarkdown["audit-existing-docs"] ?? ""
    },
    {
      name: "diataxis-workflow-create-docs-from-scratch",
      uri: "diataxis://workflow/create-docs-from-scratch",
      title: "Create docs from scratch workflow",
      description: "Workflow for planning a new Diataxis-aligned documentation set.",
      text: workflowMarkdown["create-docs-from-scratch"] ?? ""
    }
  ];
}
