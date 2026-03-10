import { Slot } from "@radix-ui/react-slot";
import { appBar, type AppBarVariantProps } from "@seed-design/css/recipes/app-bar";
import { appBarMain, type AppBarMainVariantProps } from "@seed-design/css/recipes/app-bar-main";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef } from "react";
import { AppBar as AppBarPrimitive } from "../../primitive";
import { useAppBarContext } from "../../primitive/AppBar/useAppBarContext";
import { createStyleContext } from "../../utils/createStyleContext";
import { useTopActivity } from "../../primitive/private/useTopActivity";
import { useActivity } from "@stackflow/react";
import { useBoxBackgroundProps, type BoxBackgroundProps } from "../../utils/styled";

const { PropsProvider, ClassNamesProvider, useProps, withContext, useClassNames } =
  createStyleContext(appBar);
const {
  PropsProvider: MainPropsProvider,
  withProvider: withMainProvider,
  withContext: withMainContext,
} = createStyleContext(appBarMain);

export const AppBarPropsProvider = PropsProvider;

export interface AppBarProps
  extends AppBarVariantProps,
    AppBarPrimitive.RootProps,
    BoxBackgroundProps {}

export const AppBarRoot = forwardRef<HTMLDivElement, AppBarProps>((props, ref) => {
  const { style: boxStyle, restProps: propsWithoutBoxProps } = useBoxBackgroundProps(props);

  const contextProps = useProps();
  const [variantProps, otherProps] = appBar.splitVariantProps({
    ...contextProps,
    ...propsWithoutBoxProps,
  });

  const topActivityTransitionStyle = useTopActivity().transitionStyle;

  const resolvedVariantProps: AppBarVariantProps = {
    // this includes the default transitionStyle decided by theme, from contextProps or props
    ...variantProps,
    ...(useActivity().isTop === false && {
      transitionStyle: topActivityTransitionStyle as NonNullable<
        AppBarVariantProps["transitionStyle"]
      >,
    }),
  };

  const classNames = appBar(resolvedVariantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <MainPropsProvider value={resolvedVariantProps}>
        <AppBarPrimitive.Root
          ref={ref}
          {...mergeProps({ className: classNames.root, style: boxStyle }, otherProps)}
        />
      </MainPropsProvider>
    </ClassNamesProvider>
  );
});
AppBarRoot.displayName = "AppBarRoot";

export interface AppBarLeftProps extends AppBarPrimitive.LeftProps {}

export const AppBarLeft = withContext<HTMLDivElement, AppBarLeftProps>(
  AppBarPrimitive.Left,
  "left",
);

export interface AppBarRightProps extends AppBarPrimitive.RightProps {}

export const AppBarRight = withContext<HTMLDivElement, AppBarRightProps>(
  AppBarPrimitive.Right,
  "right",
);

export interface AppBarMainProps extends AppBarMainVariantProps, AppBarPrimitive.MainProps {}

export const AppBarMain = withMainProvider<HTMLDivElement, AppBarMainProps>(
  AppBarPrimitive.Main,
  "root",
);

export interface AppBarTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const AppBarTitle = withMainContext<HTMLSpanElement, AppBarTitleProps>(
  Primitive.span,
  "title",
);

export interface AppBarSubtitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AppBarSubtitle = withMainContext<HTMLSpanElement, AppBarSubtitleProps>(
  Primitive.span,
  "subtitle",
);

export interface AppBarIconButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AppBarIconButton = forwardRef<HTMLButtonElement, AppBarIconButtonProps>(
  ({ children, className, ...otherProps }, ref) => {
    const { stateProps } = useAppBarContext();
    const classNames = useClassNames();

    return (
      <Primitive.button
        ref={ref}
        type="button"
        className={clsx(classNames.iconButton, className)}
        {...mergeProps(stateProps, otherProps)}
      >
        <Slot className={classNames.icon} {...stateProps}>
          {children}
        </Slot>
      </Primitive.button>
    );
  },
);
AppBarIconButton.displayName = "IconButton";
