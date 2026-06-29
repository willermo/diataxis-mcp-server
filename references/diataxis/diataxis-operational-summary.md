# Diátaxis Operational Summary for Agents

This file is an operational summary of the Diátaxis documentation framework for use by AI coding and documentation agents.

It is not a replacement for the official Diátaxis website or repository.

Primary sources:

* Website: https://diataxis.fr/
* Official repository: https://github.com/evildmp/diataxis-documentation-framework
* Author: Daniele Procida
* Upstream license: CC-BY-SA 4.0

This project uses Diátaxis-derived concepts to build an MCP server that helps agents audit, refactor, plan, and generate technical documentation.

## Purpose of this summary

Agents should use this document to:

1. classify documentation needs;
2. detect confusion between documentation modes;
3. suggest documentation refactoring plans;
4. plan new documentation sets for software projects;
5. generate mode-appropriate outlines and review criteria.

Agents should not use this document to copy Diátaxis text verbatim into generated documentation.

## Core idea

Diátaxis identifies four kinds of technical documentation, each serving a different user need:

| User need     | Documentation mode | Orientation            |
| ------------- | ------------------ | ---------------------- |
| Learning      | Tutorial           | Learning-oriented      |
| Goals         | How-to guide       | Goal-oriented          |
| Information   | Reference          | Information-oriented   |
| Understanding | Explanation        | Understanding-oriented |

The central rule is:

> Documentation should be shaped by the user need it serves.

A document should not try to serve all needs at once. Mixing modes usually produces confusing documentation.

## The Diátaxis compass

Use these two questions to classify a documentation need:

1. Does the content primarily inform action or cognition?
2. Does it support acquisition of skill or application of skill?

Classification table:

| Content informs... | User is...      | Mode         |
| ------------------ | --------------- | ------------ |
| Action             | Acquiring skill | Tutorial     |
| Action             | Applying skill  | How-to guide |
| Cognition          | Applying skill  | Reference    |
| Cognition          | Acquiring skill | Explanation  |

Simplified:

* Action + learning = tutorial.
* Action + work = how-to guide.
* Knowledge + work = reference.
* Knowledge + study = explanation.

## Mode 1: Tutorial

A tutorial is a guided learning experience.

### User need

The user wants to acquire skill.

The user may be new to the product, tool, workflow, or concept. They need a safe path that helps them learn by doing.

### Primary question

“Can you teach me to do this?”

### Good tutorial characteristics

A good tutorial:

* provides a lesson;
* guides the learner step by step;
* gives the learner something meaningful to accomplish;
* produces visible results early and often;
* uses concrete examples;
* avoids unnecessary choices;
* avoids long explanation;
* builds confidence;
* assumes the learner needs guidance;
* helps the learner notice important things;
* aims for repeatability and reliability.

### Tutorial language patterns

Use patterns like:

* “In this tutorial, we will...”
* “First, do...”
* “Now, do...”
* “You should see...”
* “Notice that...”
* “Let’s check...”

Avoid patterns like:

* “You will learn...”
* “There are many ways to...”
* “In production, you may want to...”
* long theoretical digressions;
* exhaustive option lists.

### Tutorial red flags

A page may not be a good tutorial if it:

* assumes the user is already competent;
* branches into many alternatives;
* explains too much;
* tries to cover production-grade complexity;
* lacks visible outcomes;
* lacks a clear learning path;
* is really a task recipe for an already-skilled user;
* contains large reference tables.

### Agent guidance

When generating a tutorial:

* choose one safe, concrete scenario;
* remove optional paths;
* create a successful path from start to finish;
* include expected outputs;
* link to reference or explanation instead of embedding them;
* prioritize learner confidence over completeness.

When auditing a tutorial:

* check whether it teaches through doing;
* check whether the learner can succeed reliably;
* check whether explanation and reference material should be extracted.

## Mode 2: How-to guide

A how-to guide helps an already-competent user accomplish a practical task.

### User need

The user wants to apply skill to solve a real problem.

The user knows what they want to achieve and needs practical direction.

### Primary question

“How do I do this?”

### Good how-to characteristics

A good how-to guide:

* is goal-oriented;
* focuses on a real-world task;
* assumes basic competence;
* provides practical steps;
* follows a logical sequence;
* supports real-world variation where needed;
* stays focused on action;
* avoids teaching;
* avoids long explanation;
* avoids exhaustive reference material;
* links out to related reference or explanation.

### How-to language patterns

Use patterns like:

* “This guide shows you how to...”
* “To achieve X, do Y.”
* “If you need X, use Y.”
* “In this case, choose...”
* “Refer to the reference page for the full list of options.”

Avoid patterns like:

* “In this tutorial...”
* “You will learn...”
* long conceptual background;
* complete API or configuration tables;
* introductory lessons for beginners.

### How-to red flags

A page may not be a good how-to guide if it:

* has no concrete task;
* is organized around product features instead of user goals;
* teaches basic concepts at length;
* includes exhaustive option lists;
* reads like API reference;
* reads like conceptual explanation;
* tries to onboard a beginner from zero.

### Agent guidance

When generating a how-to guide:

* start from a user goal;
* define the task clearly;
* assume the user is competent enough to follow instructions;
* include only steps needed for the task;
* include branches only when they reflect real-world task variation;
* link to reference for complete options;
* link to explanation for conceptual background.

When auditing a how-to guide:

* check whether every section supports the task;
* extract concept discussion into explanation;
* extract option tables into reference;
* remove beginner teaching unless it is essential to task completion.

## Mode 3: Reference

Reference describes the machinery.

### User need

The user wants accurate information while working.

The user needs facts, names, parameters, schemas, APIs, commands, constraints, defaults, return values, errors, or configuration options.

### Primary question

“What is this?” or “What are the details?”

### Good reference characteristics

Good reference:

* is information-oriented;
* is accurate and precise;
* is neutral in tone;
* is organized according to the structure of the product or code;
* describes rather than teaches;
* uses consistent patterns;
* includes examples where useful;
* avoids discursive explanation;
* avoids task-oriented instruction except minimal usage notes;
* prioritizes completeness and reliability.

### Reference content examples

Reference commonly documents:

* APIs;
* functions;
* classes;
* methods;
* commands;
* flags;
* configuration options;
* schemas;
* environment variables;
* error codes;
* events;
* data models;
* public interfaces;
* constraints;
* defaults.

### Reference language patterns

Use patterns like:

* “The `timeout` option sets...”
* “Default: `30`.”
* “Allowed values: ...”
* “Returns: ...”
* “Raises: ...”
* “This command accepts the following flags...”

Avoid patterns like:

* “In this tutorial...”
* “To solve your problem...”
* long background discussion;
* design history;
* opinionated trade-off analysis;
* multi-step workflow guidance.

### Reference red flags

A page may not be good reference if it:

* gives a long procedural walkthrough;
* contains extensive conceptual explanation;
* is organized around user goals rather than product structure;
* is incomplete or inconsistent;
* hides facts inside prose;
* lacks predictable structure;
* uses persuasive or subjective language.

### Agent guidance

When generating reference:

* mirror the structure of the code or product;
* prefer tables, lists, schemas, and stable headings;
* make facts easy to scan;
* include concise examples only when they clarify usage;
* link to how-to guides for tasks;
* link to explanation for concepts and design rationale.

When auditing reference:

* check accuracy against the codebase when possible;
* check structural consistency;
* move task instructions to how-to guides;
* move conceptual discussion to explanation;
* identify missing API/configuration/CLI coverage.

## Mode 4: Explanation

Explanation helps users understand.

### User need

The user wants deeper understanding, context, reasons, trade-offs, design rationale, background, or conceptual clarity.

The user is not necessarily trying to complete an immediate task.

### Primary question

“Why does this work this way?” or “Can you help me understand this?”

### Good explanation characteristics

Good explanation:

* is understanding-oriented;
* discusses concepts and context;
* explains why things are the way they are;
* connects ideas;
* gives background;
* discusses alternatives and trade-offs;
* may include opinions or perspective when useful;
* supports reflection;
* avoids procedural step-by-step instructions;
* avoids exhaustive reference tables.

### Explanation content examples

Explanation commonly covers:

* architecture;
* design decisions;
* conceptual models;
* trade-offs;
* history;
* constraints;
* security model;
* performance model;
* lifecycle model;
* mental models;
* comparisons;
* rationale.

### Explanation language patterns

Use patterns like:

* “The reason for this is...”
* “This design favors X over Y because...”
* “A useful way to think about this is...”
* “Compared with...”
* “This trade-off matters when...”
* “Historically...”

Avoid patterns like:

* “Follow these steps...”
* exhaustive API tables;
* command flag listings;
* task recipes;
* beginner hand-holding.

### Explanation red flags

A page may not be good explanation if it:

* is mostly a procedure;
* is mostly a list of options;
* is mostly API detail;
* has no conceptual focus;
* attempts to solve an immediate task;
* mixes too much reference or how-to content into discussion.

### Agent guidance

When generating explanation:

* choose a bounded topic;
* explain reasons and relationships;
* include context and trade-offs;
* discuss alternatives where useful;
* link to how-to guides for actions;
* link to reference for exhaustive details;
* avoid turning the explanation into a procedure.

When auditing explanation:

* extract step-by-step instructions into how-to guides;
* extract tables and exact details into reference;
* check that the page answers a “why” or “how should I think about this?” question.

## Common mode confusions

### Tutorial vs how-to guide

Both contain steps, but they serve different needs.

Tutorial:

* serves learning;
* is for acquiring skill;
* is a lesson;
* protects the learner;
* avoids options;
* creates a safe, repeatable path.

How-to guide:

* serves work;
* is for applying skill;
* is a task guide;
* assumes competence;
* may include real-world branches;
* helps complete a practical task.

Rule of thumb:

* If the goal is learning, use tutorial.
* If the goal is completing a task, use how-to.

### Reference vs explanation

Both contain knowledge, but they serve different needs.

Reference:

* supports work;
* provides facts;
* describes the machinery;
* is consulted during task execution;
* should be structured and neutral.

Explanation:

* supports study;
* provides understanding;
* discusses concepts and reasons;
* is read for reflection;
* may include perspective and trade-offs.

Rule of thumb:

* If the user needs exact facts while working, use reference.
* If the user needs understanding, use explanation.

### How-to vs reference

How-to guides tell the user what to do to accomplish a task.

Reference tells the user what exists and how it behaves.

If a document contains both task steps and exhaustive option details, split it:

* keep the task sequence in how-to;
* move exhaustive details to reference.

### Tutorial vs explanation

Tutorials teach through guided action.

Explanation supports understanding through discussion.

If a tutorial contains long conceptual sections, split it:

* keep the guided path in tutorial;
* move conceptual discussion to explanation.

## Auditing existing documentation

When auditing a documentation page, agents should produce:

1. detected mode;
2. declared mode if available;
3. confidence;
4. evidence;
5. mode confusion warnings;
6. suggested extraction targets;
7. concrete next actions.

### Page audit checklist

Ask:

1. What user need does this page serve?
2. Is the user learning, working, looking up facts, or seeking understanding?
3. Does the title match the user need?
4. Does the structure match the mode?
5. Does the language match the mode?
6. Are there sections that belong in another mode?
7. What single refactoring action would improve the page most?
8. What content should be moved, removed, or linked?

### Page audit output shape

Recommended structured output:

```json
{
  "path": "docs/example.md",
  "declared_mode": "how-to",
  "detected_mode": "mixed",
  "primary_mode": "how-to",
  "secondary_modes": ["reference", "explanation"],
  "confidence": 0.78,
  "summary": "The page is mostly a how-to guide but contains reference tables and conceptual background.",
  "findings": [
    {
      "type": "mode_confusion",
      "severity": "medium",
      "message": "The configuration option table belongs in reference."
    }
  ],
  "recommended_actions": [
    {
      "action": "extract",
      "target_mode": "reference",
      "target_path": "docs/reference/configuration.md",
      "reason": "Configuration options should be described in reference material."
    }
  ]
}
```

## Auditing a documentation tree

When auditing a documentation tree, agents should look for:

* missing modes;
* overrepresented modes;
* mixed pages;
* weak information architecture;
* unclear titles;
* missing reference coverage;
* lack of onboarding tutorials;
* lack of task-oriented how-to guides;
* explanation scattered across task pages;
* reference details embedded in prose.

### Tree audit output shape

Recommended structured output:

```json
{
  "summary": "The documentation is reference-heavy and lacks tutorials.",
  "coverage": {
    "tutorial": 0,
    "how_to": 4,
    "reference": 8,
    "explanation": 1,
    "mixed": 3
  },
  "top_issues": [
    "No beginner tutorial exists.",
    "Several how-to pages contain large reference sections.",
    "Architecture explanation is scattered across README and setup pages."
  ],
  "recommended_refactor_plan": [
    {
      "priority": 1,
      "action": "Create a first tutorial for local setup.",
      "target_path": "docs/tutorials/get-started.md"
    },
    {
      "priority": 2,
      "action": "Extract configuration reference from setup guide.",
      "target_path": "docs/reference/configuration.md"
    }
  ]
}
```

## Planning new documentation

When planning documentation for a new project, agents should produce a balanced Diátaxis set.

The plan does not need to create empty sections for every possible document. It should propose useful initial documentation based on user needs.

### New documentation planning checklist

Ask:

1. Who are the users?
2. What must new users learn first?
3. What tasks will competent users need to perform?
4. What APIs, commands, schemas, or configuration need reference?
5. What concepts, architecture, trade-offs, or design decisions need explanation?
6. What documentation is essential for the first release?
7. What can wait?

### Suggested output shape

```json
{
  "tutorials": [
    {
      "title": "Create your first project",
      "purpose": "Give new users a successful first experience."
    }
  ],
  "how_to_guides": [
    {
      "title": "Configure authentication",
      "purpose": "Help users complete a common setup task."
    }
  ],
  "reference": [
    {
      "title": "Configuration reference",
      "purpose": "Document all supported configuration options."
    }
  ],
  "explanation": [
    {
      "title": "Architecture overview",
      "purpose": "Explain the main components and design rationale."
    }
  ]
}
```

## Refactoring principles

Agents should prefer small, incremental refactoring actions.

Do not suggest rewriting the entire documentation set unless absolutely necessary.

Preferred actions:

* rename a page to match its mode;
* split one mixed page into two or three mode-specific pages;
* extract reference tables;
* extract conceptual discussion;
* move task steps into a how-to guide;
* convert beginner walkthrough into a tutorial;
* add links between related modes;
* create a missing landing page;
* create a backlog item for missing documentation.

Avoid:

* imposing a rigid four-folder structure too early;
* creating empty documentation sections;
* moving content without explaining why;
* deleting useful content just because it is in the wrong mode;
* optimizing for taxonomy over user needs.

## Heuristic signals for classification

These are simple signals for MVP implementation. They are not absolute rules.

### Tutorial signals

* title contains “getting started”, “first”, “introduction”, “tutorial”;
* uses “we will” and “let’s”;
* includes expected outputs;
* starts from beginner assumptions;
* describes a safe end-to-end learning path;
* avoids many branches.

### How-to signals

* title starts with “How to...”;
* title names a practical task;
* uses imperative steps;
* contains conditional task guidance;
* assumes user competence;
* solves a real-world problem.

### Reference signals

* contains many tables or lists;
* documents parameters, flags, APIs, methods, schemas, events, errors;
* uses stable headings;
* contains defaults, allowed values, return values;
* mirrors product or code structure.

### Explanation signals

* title contains “overview”, “concepts”, “architecture”, “why”, “model”, “design”;
* discusses reasons and trade-offs;
* compares alternatives;
* provides background or context;
* contains few or no procedural steps.

## Agent behavior rules

When applying Diátaxis:

1. Start from user need, not document title.
2. Prefer classification with evidence.
3. Treat mixed documents as refactoring opportunities, not failures.
4. Suggest small improvements before large reorganizations.
5. Preserve useful content by moving it to the right mode.
6. Link between modes instead of duplicating content.
7. Do not claim Diátaxis guarantees technical accuracy.
8. Verify technical facts against the codebase when possible.
9. Use Diátaxis for documentation structure, purpose, and form.
10. Use code analysis, tests, schemas, and examples for technical correctness.

## What Diátaxis does not solve

Diátaxis helps with:

* documentation purpose;
* documentation structure;
* documentation mode;
* user need alignment;
* avoiding mixed content;
* improving documentation flow.

Diátaxis does not automatically solve:

* technical correctness;
* completeness;
* API accuracy;
* version drift;
* broken examples;
* outdated commands;
* security correctness;
* product design issues.

Agents must combine Diátaxis checks with codebase-aware validation.

## Minimal MVP interpretation

For this MCP server, the first useful implementation should do five things:

1. classify a documentation request;
2. audit a single page;
3. audit a documentation tree;
4. suggest a refactoring plan;
5. plan a new documentation set.

The MVP should use deterministic heuristics and structured JSON outputs.

Do not add:

* vector search;
* database persistence;
* web crawling;
* external LLM calls;
* complex scoring models;
* automatic file writes.

Those can come later.

## Licensing note

This summary is derived from the Diátaxis framework by Daniele Procida.

Diátaxis source material is licensed under CC-BY-SA 4.0.

Any Diátaxis-derived content, checklist, prompt, or documentation in this project should preserve attribution and remain compatible with CC-BY-SA 4.0.

The software implementation of the MCP server may use a separate software license, such as MIT or Apache-2.0, if clearly separated from Diátaxis-derived content.
