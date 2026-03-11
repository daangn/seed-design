import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { usePreventTouchDuringTransition } from "@stackflow/react-ui-core";
import { forwardRef, useRef } from "react";
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

  return (
    <AppScreenProvider value={api}>
      <Primitive.div
        ref={composeRefs(innerRef, ref)}
        data-stackflow-component-name="AppScreen"
        {...mergeProps(api.activityProps, otherProps)}
      />
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
  const { layerProps } = useAppScreenContext();

  return <Primitive.div ref={ref} {...mergeProps(layerProps, props)} />;
});
AppScreenLayer.displayName = "AppScreenLayer";
