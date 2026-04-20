/**
 * Parts of the AppBar anatomy.
 *
 * Each value is the literal `data-part` attribute placed on the rendered DOM.
 * Consumers in the styled layer and in GlobalInteraction/dom.ts import from
 * here to keep markup and DOM queries in sync.
 */
export const appBarAnatomy = {
  root: "appBar",
  main: "appBarMain",
  icon: "appBarIcon",
  custom: "appBarCustom",
} as const;

export type AppBarPart = (typeof appBarAnatomy)[keyof typeof appBarAnatomy];
