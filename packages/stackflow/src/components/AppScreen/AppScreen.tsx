import { appScreen, type AppScreenVariantProps } from "@seed-design/css/recipes/app-screen";
import { forwardRef, useMemo } from "react";
import { AppScreen as AppScreenPrimitive } from "../../primitive";
import { createStyleContext } from "../../utils/createStyleContext";
import { AppBarPropsProvider } from "../AppBar/AppBar";
import { mergeProps } from "@seed-design/dom-utils";

const { ClassNamesProvider, PropsProvider, withContext, useProps } = createStyleContext(appScreen);

export const AppScreenPropsProvider = PropsProvider;

export interface AppScreenRootProps extends AppScreenVariantProps, AppScreenPrimitive.RootProps {}

export const AppScreenRoot = forwardRef<HTMLDivElement, AppScreenRootProps>((props, ref) => {
  const contextProps = useProps();
  const [variantProps, otherProps] = appScreen.splitVariantProps({ ...contextProps, ...props });

  // TODO: we have to implement conditional default in recipe; this is temporal workaround.
  const transitionStyle =
    variantProps.transitionStyle ??
    (variantProps.theme === "cupertino" ? "slideFromRightIOS" : "fadeFromBottomAndroid");

  const classNames = appScreen({
    ...variantProps,
    transitionStyle,
  });

  return (
    <ClassNamesProvider value={classNames}>
      <AppBarPropsProvider
        value={useMemo(
          () => ({ theme: variantProps.theme, transitionStyle }),
          [variantProps.theme, transitionStyle],
        )}
      >
        <AppScreenPrimitive.Root
          ref={ref}
          {...mergeProps({ className: classNames.root }, otherProps)}
        />
      </AppBarPropsProvider>
    </ClassNamesProvider>
  );
});
AppScreenRoot.displayName = "AppScreenRoot";

export interface AppScreenDimProps extends AppScreenPrimitive.DimProps {}

export const AppScreenDim = Object.assign(
  withContext<HTMLDivElement, AppScreenDimProps>(AppScreenPrimitive.Dim, "dim"),
  {
    vars: {
      zIndex: "var(--z-index-dim)",
    },
  },
);

export interface AppScreenEdgeProps extends AppScreenPrimitive.EdgeProps {}

export const AppScreenEdge = Object.assign(
  withContext<HTMLDivElement, AppScreenEdgeProps>(AppScreenPrimitive.Edge, "edge"),
  {
    vars: {
      zIndex: "var(--z-index-edge)",
    },
  },
);

export interface AppScreenLayerProps extends AppScreenPrimitive.LayerProps {}

export const AppScreenLayer = Object.assign(
  withContext<HTMLDivElement, AppScreenLayerProps>(AppScreenPrimitive.Layer, "layer"),
  {
    vars: {
      zIndex: "var(--z-index-layer)",
    },
  },
);
