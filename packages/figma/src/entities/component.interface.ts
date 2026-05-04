import type { ComponentPropertyDefinition } from "@/codegen";

export interface ComponentMetadata {
  name: string;
  key: string;
  componentPropertyDefinitions: Record<string, ComponentPropertyDefinition>;
}
