import { Slot } from "@radix-ui/react-slot";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { type AppBarVariantProps, appBar } from "@seed-design/css/recipes/app-bar";
import clsx from "clsx";
import { forwardRef } from "react";
import { AppBar as AppBarPrimitive } from "../../primitive";
import { useAppBarContext } from "../../primitive/AppBar/useAppBarContext";
import { createStyleContext } from "../../utils/createStyleContext";
import { appBarMain, type AppBarMainVariantProps } from "@seed-design/css/recipes/app-bar-main";

const { PropsProvider, ClassNamesProvider, useProps, withContext, useClassNames } =
  createStyleContext(appBar);
const {
  PropsProvider: MainPropsProvider,
  withProvider: withMainProvider,
  withContext: withMainContext,
} = createStyleContext(appBarMain);

export const AppBarPropsProvider = PropsProvider;

export interface AppBarProps extends AppBarVariantProps, AppBarPrimitive.RootProps {}

export const AppBarRoot = Object.assign(
  forwardRef<HTMLDivElement, AppBarProps>((props, ref) => {
    const contextProps = useProps();
    const [variantProps, otherProps] = appBar.splitVariantProps({ ...contextProps, ...props });

    const classNames = appBar(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <MainPropsProvider
          value={{
            theme: variantProps.theme,
            transitionStyle: variantProps.transitionStyle,
            tone: variantProps.tone,
          }}
        >
          <AppBarPrimitive.Root
            ref={ref}
            {...mergeProps({ className: classNames.root }, otherProps)}
          />
        </MainPropsProvider>
      </ClassNamesProvider>
    );
  }),
  {
    displayName: "AppBarRoot",
    vars: {
      zIndex: "var(--z-index-app-bar)",
    },
  },
);

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
