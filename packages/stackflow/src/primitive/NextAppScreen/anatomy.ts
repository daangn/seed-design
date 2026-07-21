/**
 * Parts of the NextAppScreen anatomy.
 *
 * Each value is the literal `data-part` attribute placed on the rendered DOM.
 * The values are deliberately disjoint from the legacy AppScreen anatomy
 * (`activity | dim | layer | edge`) so the legacy WAAPI engine can never
 * observe Next parts.
 */
export const nextAppScreenAnatomy = {
  root: "screen",
  dim: "screen-dim",
  layer: "screen-layer",
  content: "screen-content",
  edge: "screen-edge",
} as const;

export type NextAppScreenPart = (typeof nextAppScreenAnatomy)[keyof typeof nextAppScreenAnatomy];
