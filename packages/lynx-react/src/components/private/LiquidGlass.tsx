/// <reference path="../../blur-view.d.ts" />
import * as React from "@lynx-js/react";
import type { GlassTint } from "@seed-design/lynx-css/recipes/chip";

import { useColorMode } from "../../contexts/ColorModeContext";
import { useSeedContext, type SeedGlassEffect } from "../../contexts/SeedContext";
import type { LynxHostProps, LynxViewRef } from "../../types";
import { resolveGlassEffect, type ResolvedGlassEffect } from "../../utils/glass-effect";
import { mergeProps } from "../../utils/merge-props";
import { resolveColorScheme } from "../../utils/resolve-color-scheme";

// SEED's Liquid Glass rules live in this file. Only this file renders `<blur-view>`.

export type ActiveLiquidGlass = ResolvedGlassEffect;

/** The component's `glassEffect` prop. It overrides the one inherited from `SeedProvider`. */
export interface LiquidGlassProps {
  /**
   * Draws the component with Liquid Glass. Only iOS draws it today, and only when `SeedProvider` has
   * `supportsLiquidGlass`. `true` equals `{}`, `false` turns off the effect from `SeedProvider`, and omitting it
   * inherits that effect.
   */
  glassEffect?: boolean | SeedGlassEffect;
}

/**
 * The glass to draw on this render, or `null` to draw the regular `<view>` root.
 * Glass needs both the host flag (`supportsLiquidGlass`) and an intent: the component's `glassEffect`, or else
 * the tree's.
 */
export function useLiquidGlass(
  glassEffect: LiquidGlassProps["glassEffect"],
): ActiveLiquidGlass | null {
  const { supportsLiquidGlass, glassEffect: inherited } = useSeedContext();
  if (supportsLiquidGlass !== true) return null;
  return resolveGlassEffect(glassEffect, inherited) ?? null;
}

/**
 * Applies the glass rules to recipe variants. Without glass, returns the input unchanged so the root gets no
 * `--glass_*` class. Interactive glass draws its own press response, so the pressed background is turned off.
 */
export function withGlassVariants<V extends { pressed?: boolean }>(
  variants: V,
  glass: ActiveLiquidGlass | null,
): V & { glass?: boolean } {
  if (!glass) return variants;
  return { ...variants, pressed: glass.interactive ? false : variants.pressed, glass: true };
}

export interface LiquidGlassViewProps extends LynxHostProps<"view"> {
  glass: ActiveLiquidGlass;
  /** Disabled controls get no interactive glass response. */
  disabled: boolean;
  /** The recipe state's `root.color` from the recipe module's `glassTint`. */
  tint: GlassTint;
}

/**
 * iOS Liquid Glass root. Takes the caller's recipe root className, props and children and renders them on
 * `<blur-view>`, so the content sits in the glass and moves with its interactive response.
 *
 * - iOS blur-view does not draw `background*`, and `glass-tint-color` takes a resolved color, not a CSS variable. The
 *   caller passes the recipe state's background resolved for both themes, and the applied theme picks one, like native
 *   SEED's `spec.root.color`. A `className` that overrides the background does not change the tint.
 * - Content stays in the glass even when the tint changes. Rendering it behind the content instead loses the
 *   interactive response on the content, because the content views take the touches.
 */
export const LiquidGlassView = React.forwardRef<unknown, LiquidGlassViewProps>((props, ref) => {
  const { glass, disabled, tint, children, className, ...nativeProps } = props;
  const colorMode = useColorMode();
  const { preferredColorScheme } = useSeedContext();
  // Same rule as the root `<page>` className, so the tint matches the CSS theme.
  const colorScheme = resolveColorScheme(colorMode, () => preferredColorScheme);
  // Under `"system"` an unknown host preference stays unset, so iOS follows the system appearance.
  const userInterfaceStyle = colorMode === "system" ? preferredColorScheme : colorScheme;

  return (
    <blur-view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={className}
      blur-effect="glass"
      glass-style={glass.style}
      glass-interactive={glass.interactive && !disabled}
      glass-tint-color={tint[colorScheme]}
      ios-user-interface-style={userInterfaceStyle}
    >
      {children}
    </blur-view>
  );
});
LiquidGlassView.displayName = "LiquidGlassView";
