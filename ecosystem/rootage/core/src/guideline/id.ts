import type { GuidelineScope } from "./types";

/**
 * Scope → single-letter prefix used in generated guideline ids.
 */
export const GUIDELINE_SCOPE_PREFIX: Record<GuidelineScope, string> = {
  component: "C",
  foundation: "F",
  pattern: "P",
};

/**
 * Generate a stable guideline id.
 *
 * Format: `G-{SCOPE_PREFIX}-{target}-{NNN}` where NNN is the 1-based, 3-digit
 * zero-padded sequence within the file. Deprecated items keep their slot, so the
 * sequence has no gaps and is derived purely from array order.
 *
 * @param scope  guideline scope (component/foundation/pattern)
 * @param target file name without extension (e.g. "action-button")
 * @param index  zero-based index of the item within `guidelines`
 */
export function generateGuidelineId(scope: GuidelineScope, target: string, index: number): string {
  const prefix = GUIDELINE_SCOPE_PREFIX[scope];
  const sequence = String(index + 1).padStart(3, "0");
  return `G-${prefix}-${target}-${sequence}`;
}
