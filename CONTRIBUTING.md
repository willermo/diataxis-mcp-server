# Contributing

Thanks for your interest in contributing to `diataxis-mcp-server`.

This project is an experimental MCP server that helps coding and documentation agents apply the Diátaxis framework to technical documentation workflows.

Contributions are welcome through issues and pull requests.

## Project goals

The project aims to provide deterministic, structured MCP tools that help agents:

* classify documentation requests and pages according to Diátaxis;
* audit existing documentation for mode confusion;
* suggest incremental documentation refactoring plans;
* plan new documentation sets for software projects;
* expose short Diátaxis-derived checklists, resources, and prompts to MCP clients.

The project is not intended to be a full copy of the Diátaxis website, a generic RAG system, or an LLM-powered documentation generator.

## Before contributing

Before changing core behavior, read:

* `README.md`
* `AGENTS.md`
* `references/diataxis/sources.md`
* `references/diataxis/diataxis-operational-summary.md`
* `LICENSING.md`
* `NOTICE.md`

Diátaxis-derived content must remain short, operational, attributed, and compatible with CC-BY-SA 4.0.

## Development setup

Install dependencies:

```sh
npm install
```

Run tests:

```sh
npm test
```

Run the build:

```sh
npm run build
```

Run the local MCP server over stdio:

```sh
node dist/index.js
```

Before opening a pull request, run:

```sh
npm run build
npm test
```

## Repository structure

Important directories:

* `src/core`: deterministic Diátaxis classification, audit, refactor, and planning logic.
* `src/mcp`: MCP server setup, tool registration, resources, and prompts.
* `src/content`: short operational checklists and workflow text.
* `src/types`: shared Zod schemas and TypeScript types.
* `test`: unit tests, smoke tests, and Markdown fixtures.
* `examples`: IDE and MCP client configuration examples.
* `references/diataxis`: local source-of-truth notes for Diátaxis-derived behavior.

Keep business logic in `src/core`.

Keep MCP transport and registration logic in `src/mcp`.

## Contribution guidelines

### Keep the MVP deterministic

Do not add external LLM API calls, embeddings, vector search, crawling, databases, persistence, telemetry, or network access unless there is a clear design discussion and maintainer approval first.

The current implementation should remain deterministic and testable.

### Add tests for heuristic changes

Every change to classification, audit, refactor, or planning heuristics should include tests.

Useful tests include:

* clear positive examples;
* ambiguous mixed-mode pages;
* negative examples that should not be misclassified;
* regression fixtures for known edge cases;
* non-English or accented-title cases when relevant.

### Prefer small, incremental changes

Good pull requests are focused and easy to review.

Prefer:

* one behavior change per PR;
* one schema extension per PR;
* small documentation improvements;
* explicit tests for new behavior.

Avoid large rewrites unless discussed first in an issue.

### Preserve Diátaxis mode separation

When adding or changing behavior, keep the four Diátaxis modes distinct:

* tutorial: learning-oriented guided lesson;
* how-to guide: goal-oriented practical task;
* reference: information-oriented description of machinery;
* explanation: understanding-oriented conceptual discussion.

Mixed-mode documents should usually produce refactoring recommendations rather than being treated as simple failures.

### Make output useful for agents

MCP tool outputs should be structured, explicit, and easy for an agent to consume.

Prefer output that includes:

* detected mode;
* confidence;
* evidence;
* warnings;
* recommended actions;
* source paths;
* target modes;
* suggested target paths when appropriate;
* advisory language when the server does not write files.

Do not make tools perform hidden file writes or destructive actions.

### Keep examples generic

Do not commit local machine paths, usernames, secrets, tokens, or private environment details.

Use placeholders such as:

```text
<absolute-path-to-checkout>/dist/index.js
```

Do not use paths like:

```text
/home/some-user/workarea/project/dist/index.js
```

### Licensing and attribution

This repository uses a split license model.

Code, build configuration, package metadata, and tests are licensed under Apache-2.0.

Documentation, examples, prompts, checklists, rubrics, workflow text, and Diátaxis-derived operational guidance are licensed under CC-BY-SA 4.0.

Diátaxis attribution is recorded in `NOTICE.md`.

When adding Diátaxis-derived content:

* keep it short and operational;
* do not copy long verbatim upstream text;
* preserve attribution to Diátaxis and Daniele Procida;
* ensure the content remains compatible with CC-BY-SA 4.0.

## Pull request checklist

Before opening a pull request, confirm:

* [ ] The change is focused and clearly described.
* [ ] `npm run build` passes.
* [ ] `npm test` passes.
* [ ] New heuristics have tests.
* [ ] Public schemas were updated intentionally.
* [ ] README or examples were updated if behavior changed.
* [ ] No local paths, secrets, tokens, or private data were committed.
* [ ] Diátaxis-derived material is attributed and license-compatible.

## Issues

Issues are welcome for:

* bug reports;
* confusing classifications;
* missing test cases;
* documentation gaps;
* MCP client configuration problems;
* proposed new tools or resources;
* Diátaxis interpretation questions.

When reporting a classification or audit issue, include:

* the input title;
* the input Markdown or a minimal reproduction;
* the expected mode;
* the actual mode;
* why the current result is confusing or unhelpful.

## Security

Do not report security issues in public issues if they contain sensitive details.

For now, use the process described in `SECURITY.md`.

## Maintainer notes

This project should evolve through dogfooding.

Before adding large features, prefer using the server to audit and improve its own documentation. Useful improvements should usually appear first as tests, fixtures, or examples.
