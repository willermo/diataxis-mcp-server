# diataxis-mcp-server

MVP TypeScript MCP server that helps coding and documentation agents apply the Diataxis framework to documentation work.

The server is deterministic. It uses small heuristics and Zod schemas; it does not call external LLM APIs.

## Status

This project is experimental MVP software. The tools are intended to help agents classify, audit, and plan documentation, but the heuristics are conservative and should be reviewed by a human maintainer before large documentation refactors.

Refactor recommendations are advisory. The server suggests extraction targets, navigation groups, and possible file paths, but it does not write, move, rename, crawl, or persist files.

## What it provides

Tools:

- `classify_doc_request`: classify a documentation request or draft into tutorial, how-to, reference, or explanation.
- `audit_doc_page`: audit one Markdown page for mode fit, mixed-mode signals, extraction targets, and next actions.
- `audit_doc_tree`: audit multiple pages and summarize the documentation architecture, missing modes, dominant modes, and suggested navigation. Accepts `scope` as `full-docs`, `section`, or `sample` so coverage warnings can be interpreted correctly.
- `suggest_doc_refactor`: turn page audits into an advisory, path-aware refactoring sequence.
- `plan_doc_set`: propose an initial Diataxis-aligned documentation set from a project summary.

Resources:

- `diataxis://checklists/tutorial`
- `diataxis://checklists/how-to`
- `diataxis://checklists/reference`
- `diataxis://checklists/explanation`
- `diataxis://rubrics/classification`
- `diataxis://workflow/audit-existing-docs`
- `diataxis://workflow/create-docs-from-scratch`

## Development

```sh
npm install
npm test
npm run build
```

Run the MCP server over stdio:

```sh
npm run build
node dist/index.js
```

Example MCP client command configuration:

```json
{
  "mcpServers": {
    "diataxis": {
      "command": "node",
      "args": ["<absolute-path-to-checkout>/dist/index.js"]
    }
  }
}
```

IDE configuration examples are included in `examples/` and in the npm package for client setup. Run `npm run build` before using the local `dist/index.js` configuration.

After this package is published to npm, clients that support `npx` can use:

```json
{
  "mcpServers": {
    "diataxis": {
      "command": "npx",
      "args": ["diataxis-mcp-server"]
    }
  }
}
```

## Example tool call

Payload for `classify_doc_request`:

```json
{
  "request": "Write a guide that shows how to configure SSO for production.",
  "title": "Configure SSO",
  "audience": "Operators who already know the product"
}
```

Shortened example output:

```json
{
  "mode": "how-to",
  "confidence": 0.58,
  "warnings": [],
  "rationale": "Detected how-to because the strongest signals match accomplishing a practical task.",
  "suggestedStructure": [
    "Task goal",
    "Prerequisites",
    "Procedure",
    "Verification",
    "Related reference"
  ]
}
```

## Project layout

- `src/core`: deterministic Diataxis classification, audit, refactor, and planning logic.
- `src/mcp`: MCP server, tools, resources, and prompts.
- `src/content`: short operational checklists and workflow text.
- `test`: focused unit tests and Markdown fixtures.
- `references/diataxis`: local source-of-truth notes for Diataxis-derived behavior.

## Licensing

This repository uses a split license model.

- Code, build configuration, package metadata, and tests are licensed under Apache-2.0. See `LICENSE` for the full license text and `LICENSE-CODE.md` for the code-license scope note.
- Documentation, examples, prompts, checklists, rubrics, workflow text, and Diataxis-derived operational guidance are licensed under CC-BY-SA 4.0. See `LICENSE-CONTENT.md`.
- The split license model is summarized in `LICENSING.md`.
- Diataxis attribution notices are recorded in `NOTICE.md`.

## Attribution

This project contains operational guidance derived from Diataxis.

Diataxis was created by Daniele Procida and is published at https://diataxis.fr/. The upstream repository is https://github.com/evildmp/diataxis-documentation-framework, and the upstream content license is CC-BY-SA 4.0.

This project is not affiliated with or endorsed by the Diataxis project.
