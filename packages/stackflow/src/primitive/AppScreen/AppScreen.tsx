import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { usePreventTouchDuringTransition } from "@stackflow/react-ui-core";
import { forwardRef, useEffect, useRef } from "react";
import { useAppScreen, type UseAppScreenProps } from "./useAppScreen";
import { AppScreenProvider, useAppScreenContext } from "./useAppScreenContext";

export interface AppScreenRootProps
  extends PrimitiveProps,
    UseAppScreenProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AppScreenRoot = forwardRef<HTMLDivElement, AppScreenRootProps>((props, ref) => {
  const {
    swipeBackDisplacementRatioThreshold,
    swipeBackVelocityThreshold,
    onSwipeBackEnd,
    onSwipeBackMove,
    onSwipeBackStart,
    ...otherProps
  } = props;
  const innerRef = useRef<HTMLDivElement>(null);
  const api = useAppScreen({
    swipeBackDisplacementRatioThreshold,
    swipeBackVelocityThreshold,
    onSwipeBackEnd,
    onSwipeBackMove,
    onSwipeBackStart,
  });
  usePreventTouchDuringTransition({
    ref: innerRef as React.RefObject<HTMLDivElement>,
  });

  // Focus the layer once after the enter animation completes.
  // onMountAutoFocus fires during enter-active and interrupts the CSS animation, so we
  // defer until transitionState reaches "enter-done". This only happens once per activity
  // lifecycle — subsequent isTop changes (e.g. upper activity pop) don't change
  // transitionState, so the effect won't re-fire.
  useEffect(() => {
    if (api.activity?.transitionState === "enter-done") {
      // `preventScroll` so moving focus never scrolls an ancestor. The layer already fills
      // the viewport, so the browser's default scroll-into-view is at best a no-op — and at
      // worst a jarring jump when the app is embedded in a scrollable host (e.g. an iframe).
      api.layerRef.current?.focus({ preventScroll: true });
    }
  }, [api.activity?.transitionState, api.layerRef]);

  return (
    <AppScreenProvider value={api}>
      {/* onMountAutoFocus is prevented because it fires during enter-active and
          interrupts the CSS animation. Focus is handled by the useEffect above instead,
          which defers until transitionState reaches "enter-done". */}
      <FocusScope asChild trapped loop onMountAutoFocus={(e) => e.preventDefault()}>
        <Primitive.div
          ref={composeRefs(innerRef, ref)}
          data-stackflow-component-name="AppScreen"
          {...mergeProps(api.activityProps, otherProps)}
        />
      </FocusScope>
    </AppScreenProvider>
  );
});
AppScreenRoot.displayName = "AppScreenRoot";

export interface AppScreenDimProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AppScreenDim = forwardRef<HTMLDivElement, AppScreenDimProps>((props, ref) => {
  const { dimProps } = useAppScreenContext();

  return <Primitive.div ref={ref} {...mergeProps(dimProps, props)} />;
});
AppScreenDim.displayName = "AppScreenDim";

export interface AppScreenEdgeProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AppScreenEdge = forwardRef<HTMLDivElement, AppScreenEdgeProps>((props, ref) => {
  const { edgeProps } = useAppScreenContext();

  return <Primitive.div ref={ref} {...mergeProps(edgeProps, props)} />;
});
AppScreenEdge.displayName = "AppScreenEdge";

export interface AppScreenLayerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AppScreenLayer = forwardRef<HTMLDivElement, AppScreenLayerProps>((props, ref) => {
  const { layerProps, layerRef } = useAppScreenContext();

  return (
    <Primitive.div
      ref={composeRefs(ref, layerRef)}
      tabIndex={-1}
      {...mergeProps(layerProps, props)}
    />
  );
});
AppScreenLayer.displayName = "AppScreenLayer";
