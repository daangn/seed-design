import { z } from "zod";

export const checkboxGroupSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  errorMessage: z.string().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export const checkboxGroupDescription =
  "Group container for multiple Checkbox components. Provides shared label, description, and error message. Children must be Checkbox components.";

export const checkboxSchema = z.object({
  label: z.string().optional(),
  checked: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  value: z.string().optional(),
});

export const checkboxDescription =
  "Single checkbox input. Can be used standalone or inside a CheckboxGroup. Use label prop for the checkbox label text.";
