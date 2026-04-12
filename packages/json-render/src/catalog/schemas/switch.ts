import { z } from "zod";

export const switchSchema = z.object({
  label: z.string().optional(),
  checked: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  size: z.enum(["16", "24", "32"]).optional(),
});

export const switchDescription =
  "Toggle switch component. Use label prop for descriptive text. Default size is '32' (largest).";
