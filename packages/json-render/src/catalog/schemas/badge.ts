import { z } from "zod";

export const badgeSchema = z.object({
  label: z.string().optional(),
  variant: z.enum(["weak", "solid", "outline", "inverted"]).optional(),
  size: z.enum(["medium", "large"]).optional(),
  tone: z
    .enum(["neutral", "brand", "informative", "positive", "critical", "warning", "magic"])
    .optional(),
});

export const badgeDescription =
  "Status badge/tag component. Use label prop for text. Use tone for semantic color (e.g., 'positive' for success, 'critical' for error).";
