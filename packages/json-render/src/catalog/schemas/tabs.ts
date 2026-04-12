import { z } from "zod";

export const tabsRootSchema = z.object({
  defaultValue: z.string().optional(),
  value: z.string().optional(),
});

export const tabsRootDescription =
  "Tab container. Must contain TabsList and TabsContent children. Use defaultValue to set initial active tab.";

export const tabsListSchema = z.object({});

export const tabsListDescription =
  "Tab trigger list. Must be inside TabsRoot. Children must be TabsTrigger components.";

export const tabsTriggerSchema = z.object({
  label: z.string().optional(),
  value: z.string(),
  notification: z.boolean().optional(),
});

export const tabsTriggerDescription =
  "Individual tab trigger button. Use label prop for tab text. value is required and must match a TabsContent value.";

export const tabsContentSchema = z.object({
  value: z.string(),
});

export const tabsContentDescription =
  "Tab content panel. Must be inside TabsRoot. value must match a TabsTrigger value. Content goes as children.";
