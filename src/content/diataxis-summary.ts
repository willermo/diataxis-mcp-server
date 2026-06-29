export const attributionMarkdown = [
  "Derived operational guidance based on the Diataxis framework.",
  "",
  "Primary source: https://diataxis.fr/",
  "Official repository: https://github.com/evildmp/diataxis-documentation-framework",
  "Author: Daniele Procida",
  "Upstream license: CC-BY-SA 4.0"
].join("\n");

export const classificationRubricMarkdown = [
  "# Diataxis classification rubric",
  "",
  "Use the user need as the main signal.",
  "",
  "| Need | Mode | Operational test |",
  "| --- | --- | --- |",
  "| Learn by doing | Tutorial | Is this a guided lesson for acquiring skill? |",
  "| Complete work | How-to guide | Is this a practical task for a competent user? |",
  "| Look up facts | Reference | Is this exact information about machinery? |",
  "| Understand why | Explanation | Is this context, rationale, or conceptual discussion? |",
  "",
  "Mixed pages should usually keep one primary mode and extract the rest."
].join("\n");

export const workflowMarkdown: Record<string, string> = {
  "audit-existing-docs": [
    "# Audit existing docs workflow",
    "",
    "1. Classify each page by user need.",
    "2. Compare detected mode with title, location, and declared intent.",
    "3. Identify strong secondary-mode signals.",
    "4. Extract task steps, reference facts, or concept discussion into separate pages.",
    "5. Apply the smallest refactor that makes each page serve one clear need."
  ].join("\n"),
  "create-docs-from-scratch": [
    "# Create docs from scratch workflow",
    "",
    "1. Summarize the project, audience, and public interfaces.",
    "2. Choose one beginner path for the tutorial.",
    "3. Turn common user goals into how-to guides.",
    "4. Mirror APIs, commands, configuration, and schemas in reference pages.",
    "5. Add explanation pages for architecture, rationale, and trade-offs."
  ].join("\n")
};
