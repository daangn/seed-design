import { IconHashLine, IconTimerLine } from "@karrotmarket/react-monochrome-icon";
import type { ComponentType, SVGProps } from "react";
import { IconLayers, IconRuler, IconSpline } from "./icons";

/**
 * Glyph per rootage `AST.ValueLit` kind. Colours and gradients are absent because they
 * are always drawn as a swatch instead.
 *
 * Keyed by plain string rather than the AST union so the search dialog can use it
 * without importing `@seed-design/rootage-core` into the page bundle.
 */
export const TOKEN_KIND_ICON: Record<string, ComponentType<SVGProps<SVGSVGElement>> | undefined> = {
  CubicBezierLit: IconSpline,
  DimensionLit: IconRuler,
  DurationLit: IconTimerLine,
  NumberLit: IconHashLine,
  ShadowLit: IconLayers,
};
