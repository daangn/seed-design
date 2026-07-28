export { loadSeedRulePack, type LoadSeedRulePackOptions } from "./preset";
export { loadRootageKnowledge, type RootageKnowledge } from "./knowledge/rootage";
export { loadRegistryKnowledge } from "./knowledge/registry";
export { REFERENCE_PATHS, docsReference } from "./guidance";
export { IDENTIFIER_OVERRIDES } from "./rules/component-reviews";
export { loadGuidelineDocIds } from "./knowledge/guideline-docs";
export {
  createComponentUsageReviewRule,
  type ComponentUsageReviewOptions,
} from "./rules/component-usage-review";
export {
  createNoDeprecatedComponentRule,
  type NoDeprecatedComponentOptions,
} from "./rules/no-deprecated-component";
export {
  createSnippetGenerationRule,
  type SnippetGenerationOptions,
} from "./rules/snippet-generation";
export { createValidVariantRule, type ValidVariantOptions } from "./rules/valid-variant";
export type {
  ComponentVariantSpec,
  DeprecatedComponent,
  DeprecatedSnippetItem,
  SeedDoctorKnowledge,
  SnippetItem,
} from "./knowledge/types";
