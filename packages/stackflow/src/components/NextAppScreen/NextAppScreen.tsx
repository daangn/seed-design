import {
  nextAppScreen,
  type NextAppScreenVariantProps,
} from "@seed-design/css/recipes/next-app-screen";
import { nextAppBar } from "@seed-design/css/recipes/next-app-bar";
import { mergeProps } from "@seed-design/dom-utils";
import { createContext, forwardRef, useContext, useMemo } from "react";
import { NextAppScreen as NextAppScreenPrimitive } from "../../primitive";
import { useNextScreenStatus } from "../../primitive/NextAppScreen/useNextScreenStatus";
import { createStyleContext, mergeContextProps } from "../../utils/createStyleContext";
import { NextAppBarPropsProvider } from "../NextAppBar/NextAppBar";

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
    NextAppScreenPrimitive.RootProps {
  /**
   * Corner radius of the device display, matched by the clip that runs while a
   * transition or a swipe-back gesture is in flight. A number means px; a
   * string is any CSS length. Unset, nothing is clipped.
   *
   * The web has no way to read the display's own radius, so pass what the host
   * knows — on iOS that is `UIScreen._displayCornerRadius` (55.0pt on iPhone 15
   * Pro), and an iOS point maps 1:1 to a CSS px.
   */
  clipRadius?: string | number;
}

export const NextAppScreenRoot = forwardRef<HTMLDivElement, NextAppScreenRootProps>(
  (props, ref) => {
    const contextProps = useContext(NextAppScreenPropsContext);
    const [variantProps, { clipRadius, ...otherProps }] = nextAppScreen.splitVariantProps(
      mergeContextProps(contextProps, props),
    );

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

    const clipStyle = useMemo(
      () =>
        clipRadius === undefined
          ? undefined
          : ({
              "--seed-next-app-screen-clip-radius":
                typeof clipRadius === "number" ? `${clipRadius}px` : clipRadius,
            } as React.CSSProperties),
      [clipRadius],
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
            {...mergeProps(
              { className: classNames.root, ...(clipStyle && { style: clipStyle }) },
              otherProps,
            )}
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
