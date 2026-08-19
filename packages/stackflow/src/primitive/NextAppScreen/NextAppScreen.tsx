import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { usePreventTouchDuringTransition } from "@stackflow/react-ui-core";
import { forwardRef, useEffect } from "react";
import { useNextAppScreen, type UseNextAppScreenProps } from "./useNextAppScreen";
import { NextAppScreenProvider, useNextAppScreenContext } from "./useNextAppScreenContext";

const preventFocusEvent = (event: Event) => event.preventDefault();

export interface NextAppScreenRootProps
  extends PrimitiveProps,
    UseNextAppScreenProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextAppScreenRoot = forwardRef<HTMLDivElement, NextAppScreenRootProps>(
  (props, ref) => {
    const {
      transitionStyle,
      swipeBackArea,
      swipeBackDisplacementRatioThreshold,
      swipeBackVelocityThreshold,
      onSwipeBackEnd,
      onSwipeBackMove,
      onSwipeBackStart,
      ...otherProps
    } = props;
    const api = useNextAppScreen({
      transitionStyle,
      swipeBackArea,
      swipeBackDisplacementRatioThreshold,
      swipeBackVelocityThreshold,
      onSwipeBackEnd,
      onSwipeBackMove,
      onSwipeBackStart,
    });
    usePreventTouchDuringTransition({
      ref: api.refs.root as React.RefObject<HTMLDivElement>,
    });

    // Focus the layer whenever this screen rests as the top screen — after its
    // own enter transition, and again when it becomes top by an upper pop.
    // Conditioned on isTop so a behind screen (still enter-done) never steals
    // focus, and re-runs are safe (no once-per-lifecycle assumption).
    const { isTop, screenState } = api;
    const layerRef = api.refs.layer;
    useEffect(() => {
      if (!isTop || screenState !== "idle") return;

      // `preventScroll` so moving focus never scrolls an ancestor. The layer
      // already fills the viewport, so scroll-into-view is at best a no-op —
      // and at worst a jarring jump in a scrollable host (e.g. an iframe).
      layerRef.current?.focus({ preventScroll: true });
    }, [isTop, screenState, layerRef]);

    return (
      <NextAppScreenProvider value={api}>
        {/* Both auto-focus moments are prevented: mount auto-focus fires during
            enter-active and interrupts the CSS animation (handled by the effect
            above instead), and unmount auto-focus would steal focus back to a
            stale node while stackflow tears the screen down. */}
        <FocusScope
          asChild
          trapped={isTop}
          loop
          onMountAutoFocus={preventFocusEvent}
          onUnmountAutoFocus={preventFocusEvent}
        >
          <Primitive.div
            ref={composeRefs(api.refs.root, ref)}
            data-stackflow-component-name="NextAppScreen"
            {...mergeProps(api.rootProps, otherProps)}
          />
        </FocusScope>
      </NextAppScreenProvider>
    );
  },
);
NextAppScreenRoot.displayName = "NextAppScreenRoot";

export interface NextAppScreenDimProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextAppScreenDim = forwardRef<HTMLDivElement, NextAppScreenDimProps>((props, ref) => {
  const { dimProps, refs } = useNextAppScreenContext();

  return <Primitive.div ref={composeRefs(refs.dim, ref)} {...mergeProps(dimProps, props)} />;
});
NextAppScreenDim.displayName = "NextAppScreenDim";

export interface NextAppScreenLayerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextAppScreenLayer = forwardRef<HTMLDivElement, NextAppScreenLayerProps>(
  (props, ref) => {
    const { layerProps, refs } = useNextAppScreenContext();

    return (
      <Primitive.div
        ref={composeRefs(refs.layer, ref)}
        tabIndex={-1}
        {...mergeProps(layerProps, props)}
      />
    );
  },
);
NextAppScreenLayer.displayName = "NextAppScreenLayer";

export interface NextAppScreenContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextAppScreenContent = forwardRef<HTMLDivElement, NextAppScreenContentProps>(
  (props, ref) => {
    const { contentProps, refs } = useNextAppScreenContext();

    return (
      <Primitive.div ref={composeRefs(refs.content, ref)} {...mergeProps(contentProps, props)} />
    );
  },
);
NextAppScreenContent.displayName = "NextAppScreenContent";

export interface NextAppScreenEdgeProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NextAppScreenEdge = forwardRef<HTMLDivElement, NextAppScreenEdgeProps>(
  (props, ref) => {
    const { edgeProps, swipeBackArea } = useNextAppScreenContext();

    if (swipeBackArea !== "edge") return null;

    return <Primitive.div ref={ref} {...mergeProps(edgeProps, props)} />;
  },
);
NextAppScreenEdge.displayName = "NextAppScreenEdge";
