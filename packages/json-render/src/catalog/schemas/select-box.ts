import { z } from "zod";

export const radioSelectBoxRootSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  errorMessage: z.string().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  invalid: z.boolean().optional(),
  columns: z.number().optional(),
  defaultValue: z.string().optional(),
});

export const radioSelectBoxRootDescription =
  "Single-select card group (radio behavior). Use columns prop to set grid layout. Children must be RadioSelectBoxItem components.";

export const radioSelectBoxItemSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  value: z.string(),
  disabled: z.boolean().optional(),
});

export const radioSelectBoxItemDescription =
  "Single-select card option. Must be a child of RadioSelectBoxRoot. label and value are required.";

export const checkSelectBoxGroupSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  errorMessage: z.string().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  columns: z.number().optional(),
});

export const checkSelectBoxGroupDescription =
  "Multi-select card group (checkbox behavior). Use columns prop to set grid layout. Children must be CheckSelectBox components.";

export const checkSelectBoxSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  value: z.string().optional(),
  checked: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export const checkSelectBoxDescription =
  "Multi-select card option. Must be a child of CheckSelectBoxGroup. label is required.";
