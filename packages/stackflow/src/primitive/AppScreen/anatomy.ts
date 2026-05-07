/**
 * Parts of the AppScreen anatomy.
 *
 * Each value is the literal `data-part` attribute placed on the rendered DOM.
 * Consumers in GlobalInteraction/dom.ts import from here to keep markup and
 * DOM queries in sync.
 */
export const appScreenAnatomy = {
  activity: "activity",
  dim: "dim",
  layer: "layer",
  edge: "edge",
} as const;

export type AppScreenPart = (typeof appScreenAnatomy)[keyof typeof appScreenAnatomy];
