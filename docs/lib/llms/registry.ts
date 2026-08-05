import { badgeHandler } from "./handlers/badge";
import type { LLMHandler } from "./types";

/**
 * Every JSX tag llms.txt rewrites at compile time.
 *
 * A tag handled here must be dropped from `app/_llms/rules/` in the same change: the two
 * pipelines run in sequence, and the old rule matching a tag this one already rewrote
 * would find nothing — which reads as "the rule is dead" rather than "it moved".
 * The reverse order is safe, so migrate one tag at a time.
 */
export const handlers: LLMHandler[] = [badgeHandler];
