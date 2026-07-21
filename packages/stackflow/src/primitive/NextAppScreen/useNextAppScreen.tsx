import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useActivityZIndexBase } from "../../hooks";
import { nextAppScreenAnatomy } from "./anatomy";
import { useNextScreenRegistry } from "./registry";
import { useNextScreenStatus } from "./useNextScreenStatus";
import { useNextSwipeBack, type UseNextSwipeBackProps } from "./useNextSwipeBack";
import type { NextAppScreenTransitionStyle } from "./types";

export interface UseNextAppScreenProps extends UseNextSwipeBackProps {
  /**
   * The transition style of this screen. The styled layer resolves the theme
   * default (cupertino → horizontalSlide, android → verticalSlide) and passes
   * the result down.
   *
   * NOTE: the CSS transition durations are fixed (350ms for horizontalSlide,
   * 300ms enter / 150ms exit for verticalSlide and fadeIn) while stackflow's
   * configured `transitionDuration` governs unmount timing. Enter tolerates
   * any mismatch (the target holds, the transition finishes on its own), but
   * an exit gets cut off by unmount — keep `transitionDuration` at or above
   * the largest CSS exit duration (350ms covers every style).
   *
   * @default "horizontalSlide"
   */
  transitionStyle?: NextAppScreenTransitionStyle;
}

export type UseNextAppScreenReturn = ReturnType<typeof useNextAppScreen>;

export function useNextAppScreen(props: UseNextAppScreenProps) {
  const { transitionStyle = "horizontalSlide", swipeBackArea = "edge", ...swipeBackProps } = props;

  const registry = useNextScreenRegistry();
  const { activity, isTop, screenState, effectiveTransitionStyle } =
    useNextScreenStatus(transitionStyle);

  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  // Register this screen (style + elements) into the per-stack registry.
  // Runs in a layout effect and cleans up symmetrically, so it is re-entrant
  // (StrictMode / future <Activity> hide-show safe).
  const activityId = activity?.id;
  useLayoutEffect(() => {
    if (!registry || !activityId) return;

    registry.register(activityId, {
      transitionStyle,
      rootEl: rootRef.current,
      layerEl: layerRef.current,
      dimEl: dimRef.current,
    });
    return () => registry.unregister(activityId);
  }, [registry, activityId, transitionStyle]);

  // Flips one frame AFTER the mounting paint (double rAF — a single rAF can
  // fire within the same frame). While absent, the recipe pins the enter
  // start position, so the slide-in transition departs from the offset
  // instead of the resting position. Re-mounts (StrictMode, future
  // <Activity> restore) reset to false, which doubles as "no transition on
  // restore" protection.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const { rootProps: swipeBackRootProps, edgeProps: swipeBackEdgeProps } = useNextSwipeBack({
    ...swipeBackProps,
    swipeBackArea,
    rootRef,
    layerRef,
    dimRef,
    screenState,
  });

  const zIndexBase = useActivityZIndexBase();
  const zIndexStyle = useMemo(
    () =>
      ({
        "--z-index-base": zIndexBase.toString(),
      }) as React.CSSProperties,
    [zIndexBase],
  );

  const isActive = activity?.isActive;

  return useMemo(
    () => ({
      activity,
      isTop,
      screenState,
      transitionStyle: effectiveTransitionStyle,
      swipeBackArea,
      refs: {
        root: rootRef,
        layer: layerRef,
        dim: dimRef,
      },
      rootProps: elementProps({
        "data-part": nextAppScreenAnatomy.root,
        "data-screen-state": screenState,
        "data-screen-transition-style": effectiveTransitionStyle,
        "data-screen-is-top": dataAttr(isTop),
        "data-screen-is-active": dataAttr(isActive),
        "data-screen-ready": dataAttr(ready),
        ...swipeBackRootProps,
        style: zIndexStyle,
      }),
      dimProps: elementProps({
        "data-part": nextAppScreenAnatomy.dim,
      }),
      layerProps: elementProps({
        "data-part": nextAppScreenAnatomy.layer,
      }),
      contentProps: elementProps({
        "data-part": nextAppScreenAnatomy.content,
      }),
      edgeProps: elementProps({
        "data-part": nextAppScreenAnatomy.edge,
        "aria-hidden": true,
        tabIndex: -1,
        ...swipeBackEdgeProps,
      }),
    }),
    [
      activity,
      isTop,
      isActive,
      ready,
      screenState,
      effectiveTransitionStyle,
      swipeBackArea,
      swipeBackRootProps,
      swipeBackEdgeProps,
      zIndexStyle,
    ],
  );
}
