import { z } from "zod";

export const calloutSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  tone: z.enum(["neutral", "informative", "positive", "warning", "critical", "magic"]).optional(),
});

export const calloutDescription =
  "Informational callout/banner. description is required. Use tone for semantic color (e.g., 'informative' for info, 'warning' for alerts, 'critical' for errors).";
