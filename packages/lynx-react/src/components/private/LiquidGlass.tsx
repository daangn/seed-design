/// <reference path="../../blur-view.d.ts" />
import * as React from "@lynx-js/react";
import { runOnMainThread, useEffect, useMainThreadRef, type RefObject } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";

import { useSeedContext, type SeedGlassEffect } from "../../contexts/SeedContext";
import type { LynxHostProps, LynxViewProps, LynxViewRef } from "../../types";
import { resolveGlassEffect, type ResolvedGlassEffect } from "../../utils/glass-effect";
import { mergeProps } from "../../utils/merge-props";

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

type GlassElement = MainThread.Element & {
  getComputedStyleProperty?: (name: string) => string;
};

/**
 * Lynx serializes a color with alpha < 255 as `argb(r, g, b, 0)`: the alpha is lost and iOS cannot parse it.
 * Such a color gives no tint instead of a wrong one (https://github.com/lynx-family/lynx/issues/10814).
 */
function toGlassTintColor(computed: string | undefined): string {
  "main thread";
  return !computed || computed.startsWith("argb(") ? "" : computed;
}

/** Copies the root's computed `background-color` (the recipe's state color) to `glass-tint-color`. */
function syncGlassTint(elementRef: RefObject<GlassElement | null>) {
  "main thread";
  const element = elementRef.current;
  if (!element || typeof element.getComputedStyleProperty !== "function") return;
  let computed: string | undefined;
  try {
    computed = element.getComputedStyleProperty("background-color");
  } catch {
    // Throws below Lynx SDK 3.5. Leave the glass untinted.
    return;
  }
  const tint = toGlassTintColor(computed);
  if ((element.getAttribute("glass-tint-color") ?? "") !== tint) {
    element.setAttribute("glass-tint-color", tint);
  }
}

function cancelGlassTintSync(frameRef: RefObject<number>) {
  "main thread";
  if (frameRef.current && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }
}

/** Reads now and again on the next frame, because native may apply the class patch late. */
function scheduleGlassTintSync(
  elementRef: RefObject<GlassElement | null>,
  frameRef: RefObject<number>,
) {
  "main thread";
  cancelGlassTintSync(frameRef);
  syncGlassTint(elementRef);
  if (typeof requestAnimationFrame === "function") {
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      syncGlassTint(elementRef);
    });
  }
}

export interface LiquidGlassViewProps extends LynxHostProps<"view"> {
  glass: ActiveLiquidGlass;
  /** Disabled controls get no interactive glass response. */
  disabled: boolean;
}

/**
 * iOS Liquid Glass root. Takes the caller's recipe root className, props and children and renders them on
 * `<blur-view>`, so the content sits in the glass and moves with its interactive response.
 *
 * - iOS blur-view does not draw `background*`, so the recipe background is kept and copied to the glass tint whenever
 *   `className` (the recipe state) or the color scheme changes, like native SEED's `tintColor ?? spec.root.color`.
 * - Content stays in the glass even when the tint changes. Rendering it behind the content instead loses the
 *   interactive response on the content, because the content views take the touches.
 */
export const LiquidGlassView = React.forwardRef<unknown, LiquidGlassViewProps>((props, ref) => {
  const { glass, disabled, children, className, ...nativeProps } = props;
  const elementRef = useMainThreadRef<GlassElement | null>(null);
  const frameRef = useMainThreadRef<number>(0);
  const laidOutRef = useMainThreadRef(false);
  const { preferredColorScheme } = useSeedContext();

  // The main-thread ref may not be bound when the first effect runs, so sync again on the first layout.
  const handleLayoutChange: NonNullable<LynxViewProps["main-thread:bindlayoutchange"]> = () => {
    "main thread";
    if (laidOutRef.current || !elementRef.current) return;
    laidOutRef.current = true;
    scheduleGlassTintSync(elementRef, frameRef);
  };

  useEffect(() => {
    runOnMainThread(scheduleGlassTintSync)(elementRef, frameRef);
    return () => {
      runOnMainThread(cancelGlassTintSync)(frameRef);
    };
  }, [className, preferredColorScheme]);

  return (
    <blur-view
      {...mergeProps(
        { "main-thread:ref": elementRef, "main-thread:bindlayoutchange": handleLayoutChange },
        ref ? { ref: ref as LynxViewRef } : {},
        nativeProps,
      )}
      className={className}
      blur-effect="glass"
      glass-style={glass.style}
      glass-interactive={glass.interactive && !disabled}
      ios-user-interface-style={preferredColorScheme}
    >
      {children}
    </blur-view>
  );
});
LiquidGlassView.displayName = "LiquidGlassView";
