import { z } from "zod";

/**
 * zod schemas for validating authored GuidelineSpec YAML.
 *
 * Authors never provide `id`; it is assigned during compilation, so it is absent
 * from these authoring schemas. See {@link ./compile}.
 */

export const guidelineTypeSchema = z.enum(["do", "dont"]);

export const guidelineScopeSchema = z.enum(["component", "foundation", "pattern"]);

export const guidelineItemSchema = z.object({
  type: guidelineTypeSchema,
  statement: z.string().min(1),
  refs: z.array(z.string()).optional(),
  deprecated: z.boolean().optional(),
  reason: z.string().optional(),
  detectable: z.boolean().optional(),
});

export const guidelineMetadataSchema = z.object({
  target: z.string().min(1),
  scope: guidelineScopeSchema,
});

export const guidelineSpecSchema = z.object({
  kind: z.literal("GuidelineSpec"),
  metadata: guidelineMetadataSchema,
  guidelines: z.array(guidelineItemSchema),
});
