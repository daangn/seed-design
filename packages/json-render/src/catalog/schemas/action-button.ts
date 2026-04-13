import { z } from "zod";

export const actionButtonSchema = z.object({
  label: z.string().optional(),
  variant: z
    .enum(["brandSolid", "neutralSolid", "neutralWeak", "dangerSolid", "dangerWeak"])
    .optional(),
  size: z.enum(["xsmall", "small", "medium", "large"]).optional(),
  layout: z.enum(["withText", "iconOnly"]).optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export const actionButtonDescription =
  "Primary action button. Use label prop for button text. Use variant='brandSolid' for CTAs, 'neutralWeak' for secondary, 'dangerSolid' for destructive.";
