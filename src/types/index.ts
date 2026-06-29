import { z } from "zod";

export const diataxisModes = ["tutorial", "how-to", "reference", "explanation"] as const;

export const diataxisModeSchema = z.enum(diataxisModes);

export type DiataxisMode = z.infer<typeof diataxisModeSchema>;

export const severitySchema = z.enum(["low", "medium", "high"]);

export type Severity = z.infer<typeof severitySchema>;

export const modeScoresSchema = z
  .object({
    tutorial: z.number(),
    "how-to": z.number(),
    reference: z.number(),
    explanation: z.number()
  })
  .strict();

export type ModeScores = z.infer<typeof modeScoresSchema>;

export const dimensionScoresSchema = z
  .object({
    action: z.number(),
    cognition: z.number(),
    skillAcquisition: z.number(),
    skillApplication: z.number()
  })
  .strict();

export type DimensionScores = z.infer<typeof dimensionScoresSchema>;

export const classificationEvidenceSchema = z
  .object({
    mode: diataxisModeSchema,
    signal: z.string(),
    weight: z.number(),
    excerpt: z.string()
  })
  .strict();

export type ClassificationEvidence = z.infer<typeof classificationEvidenceSchema>;

export const classifyDocRequestInputSchema = z
  .object({
    request: z.string().min(1),
    title: z.string().min(1).optional(),
    audience: z.string().min(1).optional(),
    existingContent: z.string().min(1).optional(),
    declaredMode: diataxisModeSchema.optional()
  })
  .strict();

export type ClassifyDocRequestInput = z.infer<typeof classifyDocRequestInputSchema>;

export const classificationResultSchema = z
  .object({
    mode: diataxisModeSchema,
    confidence: z.number().min(0).max(1),
    scores: modeScoresSchema,
    dimensions: dimensionScoresSchema,
    evidence: z.array(classificationEvidenceSchema),
    warnings: z.array(z.string()),
    rationale: z.string(),
    suggestedStructure: z.array(z.string())
  })
  .strict();

export type ClassificationResult = z.infer<typeof classificationResultSchema>;

export const auditDocPageInputSchema = z
  .object({
    content: z.string().min(1),
    title: z.string().min(1).optional(),
    path: z.string().min(1).optional(),
    declaredMode: diataxisModeSchema.optional()
  })
  .strict();

export type AuditDocPageInput = z.infer<typeof auditDocPageInputSchema>;

export const modeConfusionSchema = z
  .object({
    primaryMode: diataxisModeSchema,
    confusedWith: diataxisModeSchema,
    severity: severitySchema,
    evidence: z.array(z.string()),
    recommendation: z.string()
  })
  .strict();

export type ModeConfusion = z.infer<typeof modeConfusionSchema>;

export const extractionTargetSchema = z
  .object({
    mode: diataxisModeSchema,
    suggestedTitle: z.string(),
    reason: z.string(),
    evidence: z.array(z.string())
  })
  .strict();

export type ExtractionTarget = z.infer<typeof extractionTargetSchema>;

export const auditFindingSchema = z
  .object({
    severity: severitySchema,
    message: z.string(),
    evidence: z.array(z.string()),
    recommendation: z.string()
  })
  .strict();

export type AuditFinding = z.infer<typeof auditFindingSchema>;

export const auditDocPageResultSchema = z
  .object({
    page: z
      .object({
        title: z.string(),
        path: z.string().optional()
      })
      .strict(),
    classification: classificationResultSchema,
    declaredMode: diataxisModeSchema.optional(),
    modeConfusions: z.array(modeConfusionSchema),
    extractionTargets: z.array(extractionTargetSchema),
    findings: z.array(auditFindingSchema),
    nextActions: z.array(z.string())
  })
  .strict();

export type AuditDocPageResult = z.infer<typeof auditDocPageResultSchema>;

export const auditScopeSchema = z.enum(["full-docs", "section", "sample"]);

export type AuditScope = z.infer<typeof auditScopeSchema>;

export const auditDocTreeInputSchema = z
  .object({
    pages: z.array(auditDocPageInputSchema).min(1),
    scope: auditScopeSchema.default("full-docs")
  })
  .strict();

export type AuditDocTreeInput = z.infer<typeof auditDocTreeInputSchema>;

export const navigationPageSchema = z
  .object({
    title: z.string(),
    path: z.string().optional(),
    confidence: z.number().min(0).max(1)
  })
  .strict();

export const navigationGroupSchema = z
  .object({
    mode: diataxisModeSchema,
    pages: z.array(navigationPageSchema)
  })
  .strict();

export const auditDocTreeResultSchema = z
  .object({
    scope: auditScopeSchema,
    pages: z.array(auditDocPageResultSchema),
    summary: z
      .object({
        totalPages: z.number().int().nonnegative(),
        modeCounts: modeScoresSchema,
        averageConfidence: z.number().min(0).max(1),
        pagesWithConfusion: z.number().int().nonnegative()
      })
      .strict(),
    missingModes: z.array(diataxisModeSchema),
    dominantModes: z.array(diataxisModeSchema),
    coverageWarnings: z.array(z.string()),
    suggestedNavigation: z.array(navigationGroupSchema),
    nextActions: z.array(z.string())
  })
  .strict();

export type AuditDocTreeResult = z.infer<typeof auditDocTreeResultSchema>;

export const suggestDocRefactorInputSchema = z
  .object({
    pages: z.array(auditDocPageInputSchema).min(1),
    objective: z.string().min(1).optional()
  })
  .strict();

export type SuggestDocRefactorInput = z.infer<typeof suggestDocRefactorInputSchema>;

export const refactorActionSchema = z
  .object({
    priority: severitySchema,
    operation: z.enum(["extract", "move", "rename", "link", "review"]),
    pageTitle: z.string(),
    pagePath: z.string().optional(),
    sourcePath: z.string().optional(),
    targetPath: z.string().optional(),
    targetTitle: z.string().optional(),
    action: z.string(),
    targetMode: diataxisModeSchema.optional(),
    reason: z.string()
  })
  .strict();

export const suggestDocRefactorResultSchema = z
  .object({
    objective: z.string().optional(),
    actions: z.array(refactorActionSchema),
    sequence: z.array(z.string())
  })
  .strict();

export type SuggestDocRefactorResult = z.infer<typeof suggestDocRefactorResultSchema>;

export const planDocSetInputSchema = z
  .object({
    projectName: z.string().min(1),
    projectSummary: z.string().min(1),
    audience: z.string().min(1).optional(),
    userGoals: z.array(z.string().min(1)).default([]),
    publicInterfaces: z.array(z.string().min(1)).default([]),
    constraints: z.array(z.string().min(1)).default([])
  })
  .strict();

export type PlanDocSetInput = z.infer<typeof planDocSetInputSchema>;

export const plannedDocPageSchema = z
  .object({
    mode: diataxisModeSchema,
    title: z.string(),
    purpose: z.string(),
    outline: z.array(z.string()),
    sourceSignals: z.array(z.string())
  })
  .strict();

export const planDocSetResultSchema = z
  .object({
    projectName: z.string(),
    recommendedPages: z.array(plannedDocPageSchema),
    gapsToResolve: z.array(z.string()),
    nextActions: z.array(z.string())
  })
  .strict();

export type PlanDocSetResult = z.infer<typeof planDocSetResultSchema>;
