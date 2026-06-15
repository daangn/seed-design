import { generateGuidelineId } from "./id";
import { guidelineSpecSchema } from "./schema";
import type { CompiledGuidelineItem, CompiledGuidelineSpec, GuidelineSpec } from "./types";

/**
 * Validate an unknown value as a GuidelineSpec, throwing on failure.
 */
export function parseGuidelineSpec(input: unknown): GuidelineSpec {
  return guidelineSpecSchema.parse(input);
}

/**
 * Validate an unknown value as a GuidelineSpec without throwing.
 * Mirrors zod's `safeParse` return shape.
 */
export function safeParseGuidelineSpec(input: unknown) {
  return guidelineSpecSchema.safeParse(input);
}

/**
 * Assign generated ids to each guideline item.
 *
 * Ids are derived purely from `metadata.scope`, `metadata.target` and array order,
 * so deprecated items keep their sequence slot (no gaps).
 */
export function compileGuidelineSpec(spec: GuidelineSpec): CompiledGuidelineSpec {
  const { scope, target } = spec.metadata;

  const guidelines: CompiledGuidelineItem[] = spec.guidelines.map((item, index) => ({
    id: generateGuidelineId(scope, target, index),
    ...item,
  }));

  return {
    kind: "GuidelineSpec",
    metadata: spec.metadata,
    guidelines,
  };
}

/**
 * Validate then compile an unknown value (e.g. parsed YAML) into a compiled spec.
 */
export function compileGuidelineSpecFromObject(input: unknown): CompiledGuidelineSpec {
  return compileGuidelineSpec(parseGuidelineSpec(input));
}
