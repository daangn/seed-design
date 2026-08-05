import { availableSinceHandler } from "./handlers/available-since";
import { badgeHandler } from "./handlers/badge";
import { codeBlockTabsHandler } from "./handlers/codeblock-tabs";
import { componentExampleHandler } from "./handlers/component-example";
import { componentSpecBlockHandler } from "./handlers/component-spec-block";
import { iconLibraryHandler } from "./handlers/icon-library";
import { tokenReferenceHandler } from "./handlers/token-reference";
import { typeTableHandler } from "./handlers/type-table";
import { changelogPagePlaceholder } from "./placeholders/changelog-page";
import { progressBoardPlaceholder } from "./placeholders/progress-board";
import type { LLMHandler, LLMPlaceholder } from "./types";

/**
 * Every JSX tag llms.txt rewrites at compile time.
 *
 * A tag handled here must be dropped from `app/_llms/rules/` in the same change: the two
 * pipelines run in sequence, and the old rule matching a tag this one already rewrote
 * would find nothing — which reads as "the rule is dead" rather than "it moved".
 * The reverse order is safe, so migrate one tag at a time.
 */
export const handlers: LLMHandler[] = [
  availableSinceHandler,
  badgeHandler,
  codeBlockTabsHandler,
  componentExampleHandler,
  componentSpecBlockHandler,
  iconLibraryHandler,
  tokenReferenceHandler,
  typeTableHandler,
];

/**
 * Tags deferred to read time. Same migration rule as `handlers` — a tag listed here must
 * leave `app/_llms/rules/` in the same change.
 */
export const placeholders: LLMPlaceholder[] = [changelogPagePlaceholder, progressBoardPlaceholder];
