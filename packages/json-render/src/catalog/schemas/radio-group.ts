import { z } from "zod";

export const radioGroupSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  errorMessage: z.string().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  invalid: z.boolean().optional(),
  defaultValue: z.string().optional(),
});

export const radioGroupDescription =
  "Radio button group. Provides shared label and validation. Children must be RadioGroupItem components. Use defaultValue to set initial selection.";

export const radioGroupItemSchema = z.object({
  label: z.string().optional(),
  value: z.string(),
  disabled: z.boolean().optional(),
});

export const radioGroupItemDescription =
  "Single radio option. Must be a child of RadioGroup. The value prop is required and must be unique within the group.";
