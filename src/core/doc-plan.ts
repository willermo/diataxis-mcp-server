import {
  type DiataxisMode,
  type PlanDocSetResult,
  planDocSetInputSchema,
  planDocSetResultSchema
} from "../types/index.js";

export function planDocSet(input: unknown): PlanDocSetResult {
  const parsed = planDocSetInputSchema.parse(input);
  const userGoals = parsed.userGoals.length > 0 ? parsed.userGoals : inferGoals(parsed.projectSummary);
  const interfaces = parsed.publicInterfaces.length > 0 ? parsed.publicInterfaces : inferInterfaces(parsed.projectSummary);

  const recommendedPages: PlanDocSetResult["recommendedPages"] = [
    page("tutorial", `Get started with ${parsed.projectName}`, "Give a new user one reliable first success.", [
      "What you will build or run",
      "Prerequisites",
      "Step-by-step lesson",
      "Expected result",
      "Where to go next"
    ], ["default beginner path"]),
    ...userGoals.slice(0, 4).map((goal) =>
      page("how-to", `How to ${normalizeGoalTitle(goal)}`, `Help a competent user complete: ${goal}.`, [
        "Goal",
        "Before you start",
        "Procedure",
        "Verify the result",
        "Related reference"
      ], ["user goal"])
    ),
    ...interfaces.slice(0, 4).map((item) =>
      page("reference", `${toTitleCase(item)} reference`, `Describe ${item} accurately for lookup.`, [
        "Scope",
        "Syntax or schema",
        "Fields, options, or parameters",
        "Defaults and constraints",
        "Examples"
      ], ["public interface"])
    ),
    page("explanation", `${parsed.projectName} architecture`, "Explain the main concepts and design rationale.", [
      "Problem model",
      "Core concepts",
      "Important design choices",
      "Trade-offs",
      "Operational implications"
    ], ["project summary"])
  ];

  return planDocSetResultSchema.parse({
    projectName: parsed.projectName,
    recommendedPages,
    gapsToResolve: buildGaps(parsed),
    nextActions: [
      "Validate the proposed page list with maintainers.",
      "Write the tutorial first to test the beginner path.",
      "Create reference stubs from public interfaces before filling details."
    ]
  });
}

function page(
  mode: DiataxisMode,
  title: string,
  purpose: string,
  outline: string[],
  sourceSignals: string[]
): PlanDocSetResult["recommendedPages"][number] {
  return {
    mode,
    title,
    purpose,
    outline,
    sourceSignals
  };
}

function inferGoals(summary: string): string[] {
  const lower = summary.toLowerCase();
  const goals: string[] = [];

  if (lower.includes("mcp")) {
    goals.push("configure an MCP client");
  }
  if (lower.includes("server")) {
    goals.push("run the server locally");
  }
  if (lower.includes("typescript") || lower.includes("api")) {
    goals.push("extend a tool");
  }

  return goals.length > 0 ? goals : ["install and run the project"];
}

function inferInterfaces(summary: string): string[] {
  const lower = summary.toLowerCase();
  const interfaces: string[] = [];

  if (lower.includes("cli") || lower.includes("command")) {
    interfaces.push("CLI");
  }
  if (lower.includes("api") || lower.includes("sdk")) {
    interfaces.push("API");
  }
  if (lower.includes("configuration") || lower.includes("config")) {
    interfaces.push("configuration");
  }
  if (lower.includes("mcp")) {
    interfaces.push("MCP tools and resources");
  }

  return interfaces.length > 0 ? interfaces : ["configuration"];
}

function normalizeGoalTitle(goal: string): string {
  const trimmed = goal.trim().replace(/\.$/, "");
  if (/^(use|run|configure|install|deploy|extend|create|connect)\b/i.test(trimmed)) {
    return trimmed;
  }
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildGaps(input: ReturnType<typeof planDocSetInputSchema.parse>): string[] {
  const gaps: string[] = [];

  if (input.userGoals.length === 0) {
    gaps.push("Confirm the highest-value user goals for how-to guides.");
  }
  if (input.publicInterfaces.length === 0) {
    gaps.push("List public APIs, commands, configuration, schemas, or protocols for reference coverage.");
  }
  if (input.constraints.length > 0) {
    gaps.push("Turn important constraints into explanation or reference material.");
  }

  return gaps;
}
