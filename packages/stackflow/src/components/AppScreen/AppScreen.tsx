import { appScreen, type AppScreenVariantProps } from "@ride-developer/css/recipes/app-screen";
import { mergeProps } from "@ride-developer/dom-utils";
import { forwardRef, useMemo } from "react";
import { AppScreen as AppScreenPrimitive } from "../../primitive";
import { createStyleContext } from "../../utils/createStyleContext";
import { AppBarPropsProvider } from "../AppBar/AppBar";
import { useTopActivity } from "../../primitive/private/useTopActivity";
import { useActivity } from "@stackflow/react";
import { appBar } from "@ride-developer/css/recipes/app-bar";

const { ClassNamesProvider, PropsProvider, withContext, useProps } = createStyleContext(appScreen);

export const AppScreenPropsProvider = PropsProvider;

export interface AppScreenRootProps extends AppScreenVariantProps, AppScreenPrimitive.RootProps {
  /**
   * @default "layer"
   */
  tone?: "layer" | "transparent";
}

export const AppScreenRoot = forwardRef<HTMLDivElement, AppScreenRootProps>((props, ref) => {
  const contextProps = useProps();
  const [variantProps, otherProps] = appScreen.splitVariantProps({ ...contextProps, ...props });

  // TODO: we have to implement conditional default in recipe; this is temporal workaround.
  const transitionStyle: NonNullable<AppScreenVariantProps["transitionStyle"]> =
    variantProps.transitionStyle ??
    (variantProps.theme === "cupertino" ? "slideFromRightIOS" : "fadeFromBottomAndroid");

  const topActivityTransitionStyle = useTopActivity().transitionStyle;

  const classNames = appScreen({
    ...variantProps,
    transitionStyle: useActivity().isTop
      ? transitionStyle
      : (topActivityTransitionStyle as NonNullable<AppScreenVariantProps["transitionStyle"]>),
  });

  const [appBarVariantProps] = useMemo(
    () => appBar.splitVariantProps(variantProps),
    [variantProps],
  );

  return (
    <ClassNamesProvider value={classNames}>
      <AppBarPropsProvider
        value={useMemo(
          () => ({ ...appBarVariantProps, transitionStyle }),
          [appBarVariantProps, transitionStyle],
        )}
      >
        <AppScreenPrimitive.Root
          ref={ref}
          data-transition-style={transitionStyle}
          {...mergeProps({ className: classNames.root }, otherProps)}
        />
      </AppBarPropsProvider>
    </ClassNamesProvider>
  );
});
AppScreenRoot.displayName = "AppScreenRoot";

export interface AppScreenDimProps extends AppScreenPrimitive.DimProps {}

export const AppScreenDim = withContext<HTMLDivElement, AppScreenDimProps>(
  AppScreenPrimitive.Dim,
  "dim",
);

export interface AppScreenEdgeProps extends AppScreenPrimitive.EdgeProps {}

export const AppScreenEdge = withContext<HTMLDivElement, AppScreenEdgeProps>(
  AppScreenPrimitive.Edge,
  "edge",
);

export interface AppScreenLayerProps extends AppScreenPrimitive.LayerProps {}

export const AppScreenLayer = withContext<HTMLDivElement, AppScreenLayerProps>(
  AppScreenPrimitive.Layer,
  "layer",
);
