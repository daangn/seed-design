export { buildGraph } from "./graph-builder.js";
export type { BuildOptions } from "./graph-builder.js";
export { lint } from "./lint.js";
export { parseKontextFile } from "./parser.js";
export { analyzeImpact, checkCompleteness, findAffectedBy, findDeps } from "./query.js";
export { expandTemplate, extractId, hasTemplate, toKebabCase } from "./resolver.js";
export { SchemaValidationError, validateConfig } from "./schema.js";
export type {
  AffectedEntry,
  CheckResult,
  DepResult,
  GraphEdge,
  GraphNode,
  KontextConfig,
  KontextGraph,
  LintOptions,
  LintResult,
  LintStaleWarning,
  LintSuggestion,
  Relation,
} from "./types.js";
