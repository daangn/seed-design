import {
  nextAppScreen,
  type NextAppScreenVariantProps,
} from "@seed-design/css/recipes/next-app-screen";
import { mergeProps } from "@seed-design/dom-utils";
import { createContext, forwardRef, useContext, useMemo } from "react";
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

const CLIP_RADIUS_VARS = {
  topLeft: "--seed-next-app-screen-clip-radius-top-left",
  topRight: "--seed-next-app-screen-clip-radius-top-right",
  bottomRight: "--seed-next-app-screen-clip-radius-bottom-right",
  bottomLeft: "--seed-next-app-screen-clip-radius-bottom-left",
} as const;

type ClipRadiusLength = string | number;

export type NextAppScreenClipRadius =
  | ClipRadiusLength
  | Partial<Record<keyof typeof CLIP_RADIUS_VARS, ClipRadiusLength>>;

export interface NextAppScreenRootProps
  extends NextAppScreenVariantProps,
    NextAppScreenPrimitive.RootProps {
  /**
   * Corner radius of the device display, matched by the clip that runs while a
   * transition or a swipe-back gesture is in flight. A number means px; a
   * string is any CSS length. An object sets each corner on its own, and a
   * corner it leaves out is square. Unset, nothing is clipped.
   */
  clipRadius?: NextAppScreenClipRadius;
}

export const NextAppScreenRoot = forwardRef<HTMLDivElement, NextAppScreenRootProps>(
  (props, ref) => {
    const contextProps = useContext(NextAppScreenPropsContext);
    const [variantProps, { clipRadius, ...otherProps }] = nextAppScreen.splitVariantProps(
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

    // The recipe reads all four vars without a fallback, so any clip has to set
    // every one of them or the mask drops out entirely.
    const clipStyle = useMemo(
      () =>
        clipRadius === undefined
          ? undefined
          : (Object.fromEntries(
              Object.entries(CLIP_RADIUS_VARS).map(([corner, name]) => {
                const radius =
                  typeof clipRadius === "object"
                    ? (clipRadius[corner as keyof typeof CLIP_RADIUS_VARS] ?? 0)
                    : clipRadius;

                return [name, typeof radius === "number" ? `${radius}px` : radius];
              }),
            ) as React.CSSProperties),
      [clipRadius],
    );

    return (
      <ClassNamesProvider value={classNames}>
        <NextAppScreenPrimitive.Root
          ref={ref}
          transitionStyle={variantProps.transitionStyle}
          {...mergeProps(
            { className: classNames.root, ...(clipStyle && { style: clipStyle }) },
            otherProps,
          )}
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
