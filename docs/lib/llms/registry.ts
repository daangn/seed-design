import { availableSinceHandler } from "./handlers/available-since";
import { badgeHandler } from "./handlers/badge";
import { codeBlockTabsHandler } from "./handlers/codeblock-tabs";
import { componentExampleHandler } from "./handlers/component-example";
import { componentSpecBlockHandler } from "./handlers/component-spec-block";
import { iconLibraryHandler } from "./handlers/icon-library";
import { tokenReferenceHandler } from "./handlers/token-reference";
import { changelogPagePlaceholder } from "./placeholders/changelog-page";
import { progressBoardPlaceholder } from "./placeholders/progress-board";
import type { LLMHandler, LLMPlaceholder } from "./types";

/**
 * Every JSX tag llms.txt rewrites at compile time.
 *
 * A tag added here has to be added to `app/_llms/rule-elements.ts` too, or the structure
 * filter folds it away before the handler ever sees the node — the output loses the
 * content with no error anywhere. `rule-elements.test.ts` holds the two lists together.
 */
export const handlers: LLMHandler[] = [
  availableSinceHandler,
  badgeHandler,
  codeBlockTabsHandler,
  componentExampleHandler,
  componentSpecBlockHandler,
  iconLibraryHandler,
  tokenReferenceHandler,
];

/** Tags deferred to read time. Same preservation rule as `handlers`. */
export const placeholders: LLMPlaceholder[] = [changelogPagePlaceholder, progressBoardPlaceholder];
