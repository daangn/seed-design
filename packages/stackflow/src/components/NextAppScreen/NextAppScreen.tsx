import {
  nextAppScreen,
  type NextAppScreenVariantProps,
} from "@seed-design/css/recipes/next-app-screen";
import { mergeProps } from "@seed-design/dom-utils";
import { createContext, forwardRef, useContext } from "react";
import { NextAppScreen as NextAppScreenPrimitive } from "../../primitive";
import { useNextScreenStatus } from "../../primitive/NextAppScreen/useNextScreenStatus";
import { createStyleContext, mergeContextProps } from "../../utils/createStyleContext";

const { ClassNamesProvider, withContext } = createStyleContext(nextAppScreen);

/**
 * Stack-wide root props, supplied by `seedPlugin`. Carries behavior props
 * (`swipeBackArea`) as well as recipe variants, so it is typed on the root
 * rather than on the recipe.
 */
export type NextAppScreenContextProps = Partial<Omit<NextAppScreenRootProps, "children">>;

const NextAppScreenPropsContext = createContext<NextAppScreenContextProps | null>(null);

export const NextAppScreenPropsProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: NextAppScreenContextProps;
}) => (
  <NextAppScreenPropsContext.Provider value={value}>{children}</NextAppScreenPropsContext.Provider>
);

export interface NextAppScreenRootProps
  extends NextAppScreenVariantProps,
    NextAppScreenPrimitive.RootProps {}

export const NextAppScreenRoot = forwardRef<HTMLDivElement, NextAppScreenRootProps>(
  (props, ref) => {
    const contextProps = useContext(NextAppScreenPropsContext);
    const [variantProps, otherProps] = nextAppScreen.splitVariantProps(
      mergeContextProps(contextProps, props),
    );

    // Behind screens restyle with the TOP screen's transitionStyle so their
    // parked position / behind animation matches the running transition.
    // TODO: the primitive root calls useNextScreenStatus again, so every screen subscribes to the
    // registry twice. Both read the same snapshot and agree only while this layer's default
    // transitionStyle (the recipe's) matches the primitive's own "horizontalSlide" default.
    const { effectiveTransitionStyle } = useNextScreenStatus(variantProps.transitionStyle);

    const classNames = nextAppScreen({
      ...variantProps,
      transitionStyle: effectiveTransitionStyle,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <NextAppScreenPrimitive.Root
          ref={ref}
          transitionStyle={variantProps.transitionStyle}
          {...mergeProps({ className: classNames.root }, otherProps)}
        />
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
