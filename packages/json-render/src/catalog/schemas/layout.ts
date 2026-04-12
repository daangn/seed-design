import { z } from "zod";

export const boxSchema = z.object({
  as: z.enum(["div", "section", "article", "main", "aside", "nav", "header", "footer"]).optional(),
  display: z.enum(["flex", "block", "grid", "none"]).optional(),
  justifyContent: z.string().optional(),
  alignItems: z.string().optional(),
  flexDirection: z.string().optional(),
  padding: z.string().optional(),
  paddingX: z.string().optional(),
  paddingY: z.string().optional(),
  margin: z.string().optional(),
  gap: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  bg: z.string().optional(),
  borderRadius: z.string().optional(),
  boxShadow: z.string().optional(),
});

export const boxDescription =
  "Generic container. Use dimension tokens for spacing: x1=4px, x2=8px, x3=12px, x4=16px, x6=24px, x8=32px. Use 'full' for 100%. Color tokens: bg.layerDefault (card), bg.layerBasement (page bg).";

export const vStackSchema = z.object({
  gap: z.string().optional(),
  align: z.enum(["flex-start", "center", "flex-end", "stretch", "baseline"]).optional(),
  justify: z
    .enum(["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"])
    .optional(),
  padding: z.string().optional(),
  paddingX: z.string().optional(),
  paddingY: z.string().optional(),
  width: z.string().optional(),
  bg: z.string().optional(),
});

export const vStackDescription =
  "Vertical stack (column). Use dimension tokens for gap: x1=4px, x2=8px, x3=12px, x4=16px, x6=24px, x8=32px. Example: gap='x6' for 24px spacing.";

export const hStackSchema = z.object({
  gap: z.string().optional(),
  align: z.enum(["flex-start", "center", "flex-end", "stretch", "baseline"]).optional(),
  justify: z
    .enum(["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"])
    .optional(),
  padding: z.string().optional(),
  paddingX: z.string().optional(),
  paddingY: z.string().optional(),
  width: z.string().optional(),
});

export const hStackDescription =
  "Horizontal stack (row). Use dimension tokens for gap: x1=4px, x2=8px, x3=12px, x4=16px, x6=24px, x8=32px. Example: gap='x4' for 16px spacing.";
