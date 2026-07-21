import {
  nextAppScreen,
  type NextAppScreenVariantProps,
} from "@seed-design/css/recipes/next-app-screen";
import { nextAppBar } from "@seed-design/css/recipes/next-app-bar";
import { mergeProps } from "@seed-design/dom-utils";
import { forwardRef, useMemo } from "react";
import { NextAppScreen as NextAppScreenPrimitive } from "../../primitive";
import { useNextScreenStatus } from "../../primitive/NextAppScreen/useNextScreenStatus";
import { createStyleContext } from "../../utils/createStyleContext";
import { NextAppBarPropsProvider } from "../NextAppBar/NextAppBar";

const { ClassNamesProvider, PropsProvider, withContext, useProps } =
  createStyleContext(nextAppScreen);

export const NextAppScreenPropsProvider = PropsProvider;

export interface NextAppScreenRootProps
  extends NextAppScreenVariantProps,
    NextAppScreenPrimitive.RootProps {}

export const NextAppScreenRoot = forwardRef<HTMLDivElement, NextAppScreenRootProps>(
  (props, ref) => {
    const contextProps = useProps();
    const [variantProps, otherProps] = nextAppScreen.splitVariantProps({
      ...contextProps,
      ...props,
    });

    // Default transitionStyle follows the plugin theme:
    // cupertino → horizontalSlide, android → verticalSlide.
    const transitionStyle: NonNullable<NextAppScreenVariantProps["transitionStyle"]> =
      variantProps.transitionStyle ??
      (variantProps.theme === "android" ? "verticalSlide" : "horizontalSlide");

    // Behind screens restyle with the TOP screen's transitionStyle so their
    // parked position / behind animation matches the running transition.
    const { effectiveTransitionStyle } = useNextScreenStatus(transitionStyle);

    const classNames = nextAppScreen({
      ...variantProps,
      transitionStyle: effectiveTransitionStyle,
    });

    const [appBarVariantProps] = useMemo(
      () => nextAppBar.splitVariantProps(variantProps),
      [variantProps],
    );

    return (
      <ClassNamesProvider value={classNames}>
        <NextAppBarPropsProvider
          value={useMemo(
            () => ({ ...appBarVariantProps, transitionStyle }),
            [appBarVariantProps, transitionStyle],
          )}
        >
          <NextAppScreenPrimitive.Root
            ref={ref}
            transitionStyle={transitionStyle}
            {...mergeProps({ className: classNames.root }, otherProps)}
          />
        </NextAppBarPropsProvider>
      </ClassNamesProvider>
    );
  },
);
NextAppScreenRoot.displayName = "NextAppScreenRoot";

export interface NextAppScreenDimProps extends NextAppScreenPrimitive.DimProps {}

export const NextAppScreenDim = withContext<HTMLDivElement, NextAppScreenDimProps>(
  NextAppScreenPrimitive.Dim,
  "dim",
);

export interface NextAppScreenLayerProps extends NextAppScreenPrimitive.LayerProps {}

export const NextAppScreenLayer = withContext<HTMLDivElement, NextAppScreenLayerProps>(
  NextAppScreenPrimitive.Layer,
  "layer",
);

export interface NextAppScreenContentProps extends NextAppScreenPrimitive.ContentProps {}

export const NextAppScreenContent = withContext<HTMLDivElement, NextAppScreenContentProps>(
  NextAppScreenPrimitive.Content,
  "content",
);

export interface NextAppScreenEdgeProps extends NextAppScreenPrimitive.EdgeProps {}

export const NextAppScreenEdge = withContext<HTMLDivElement, NextAppScreenEdgeProps>(
  NextAppScreenPrimitive.Edge,
  "edge",
);
