/**
 * Parts of the NextAppBar anatomy.
 *
 * Each value is the literal `data-part` attribute placed on the rendered DOM.
 * The values are deliberately disjoint from the legacy AppBar anatomy
 * (`appBar | appBarBackground | ...`) so the legacy WAAPI engine can never
 * observe Next parts.
 */
export const nextAppBarAnatomy = {
  root: "app-bar",
  background: "app-bar-background",
  main: "app-bar-main",
  icon: "app-bar-icon",
  custom: "app-bar-custom",
} as const;

export type NextAppBarPart = (typeof nextAppBarAnatomy)[keyof typeof nextAppBarAnatomy];
