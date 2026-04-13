import { z } from "zod";

export const textFieldSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  errorMessage: z.string().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  invalid: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  maxGraphemeCount: z.number().optional(),
  showRequiredIndicator: z.boolean().optional(),
});

export const textFieldDescription =
  "Text input field wrapper with label, description, and error message. Must contain a TextFieldInput or TextFieldTextarea child.";

export const textFieldInputSchema = z.object({
  placeholder: z.string().optional(),
  type: z.enum(["text", "email", "password", "number", "tel", "url", "search"]).optional(),
});

export const textFieldInputDescription =
  "Input element for TextField. Must be a direct child of TextField.";

export const textFieldTextareaSchema = z.object({
  placeholder: z.string().optional(),
  rows: z.number().optional(),
});

export const textFieldTextareaDescription =
  "Textarea element for TextField. Must be a direct child of TextField.";
