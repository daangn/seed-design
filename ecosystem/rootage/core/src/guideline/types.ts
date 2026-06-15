/**
 * GuidelineSpec authoring/compiled types.
 *
 * GuidelineSpec is a standalone spec kind (sibling to ComponentSpec/Tokens) that
 * captures human-authored design guidelines. Unlike token documents it does not
 * participate in the token graph (analyzer/resolver); it is validated and compiled
 * independently. See {@link ./compile} for the compile pipeline.
 */

export type GuidelineType = "do" | "dont";

export type GuidelineScope = "component" | "foundation" | "pattern";

/**
 * A single authored guideline item. Authors do NOT write `id`; it is assigned at
 * compile time (see {@link CompiledGuidelineItem}).
 */
export interface GuidelineItem {
  type: GuidelineType;
  /** The guideline statement (e.g. "Use a single primary action per screen"). */
  statement: string;
  /** Other guideline ids referenced by this item (cross-ref). */
  refs?: string[];
  /** Whether this item is deprecated. Deprecated items keep their sequence slot. */
  deprecated?: boolean;
  /** Explanation / replacement id when `deprecated` is true. */
  reason?: string;
  /** Whether this rule can be statically detected (consumed by doctor / get_detectable_rules). */
  detectable?: boolean;
}

export interface GuidelineMetadata {
  /** Equals the source file name without extension (e.g. "action-button"). */
  target: string;
  scope: GuidelineScope;
}

/**
 * The authored GuidelineSpec document (source of truth, no generated ids).
 */
export interface GuidelineSpec {
  kind: "GuidelineSpec";
  metadata: GuidelineMetadata;
  guidelines: GuidelineItem[];
}

/**
 * A guideline item after compilation, with its generated stable id.
 */
export interface CompiledGuidelineItem extends GuidelineItem {
  /** `G-{SCOPE_PREFIX}-{target}-{NNN}` (see {@link ./id}). */
  id: string;
}

/**
 * The compiled GuidelineSpec document emitted as JSON.
 */
export interface CompiledGuidelineSpec {
  kind: "GuidelineSpec";
  metadata: GuidelineMetadata;
  guidelines: CompiledGuidelineItem[];
}
