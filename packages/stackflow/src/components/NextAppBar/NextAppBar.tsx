import { composeRefs } from "@radix-ui/react-compose-refs";
import { Slot } from "@radix-ui/react-slot";
import { nextAppBar, type NextAppBarVariantProps } from "@seed-design/css/recipes/next-app-bar";
import {
  nextAppBarMain,
  type NextAppBarMainVariantProps,
} from "@seed-design/css/recipes/next-app-bar-main";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import clsx from "clsx";
import { forwardRef } from "react";
import { NextAppBar as NextAppBarPrimitive } from "../../primitive";
import { nextAppBarAnatomy } from "../../primitive/NextAppBar/anatomy";
import { createStyleContext } from "../../utils/createStyleContext";
import { useBoxBackgroundProps, type BoxBackgroundProps } from "../../utils/styled";

const { PropsProvider, ClassNamesProvider, useProps, withContext, useClassNames } =
  createStyleContext(nextAppBar);
const {
  PropsProvider: MainPropsProvider,
  withProvider: withMainProvider,
  withContext: withMainContext,
} = createStyleContext(nextAppBarMain);

export const NextAppBarPropsProvider = PropsProvider;
export const NextAppBarMainPropsProvider = MainPropsProvider;

export interface NextAppBarProps
  extends NextAppBarVariantProps,
    NextAppBarPrimitive.RootProps,
    BoxBackgroundProps {}

/**
 * Embedded in the NextAppScreen layer (the transition unit): the bar moves
 * with the layer as one piece, so unlike the legacy AppBar it needs no
 * behind-activity restyling or transition choreography of its own.
 */
export const NextAppBarRoot = forwardRef<HTMLDivElement, NextAppBarProps>((props, ref) => {
  const { style: boxStyle, restProps: propsWithoutBoxProps } = useBoxBackgroundProps(props);

  const contextProps = useProps();
  const [variantProps, otherProps] = nextAppBar.splitVariantProps({
    ...contextProps,
    ...propsWithoutBoxProps,
  });

  const classNames = nextAppBar(variantProps);
  const { children, ...restProps } = otherProps;

  return (
    <ClassNamesProvider value={classNames}>
      <MainPropsProvider value={variantProps}>
        <NextAppBarPrimitive.Root
          ref={ref}
          {...mergeProps({ className: classNames.root, style: boxStyle }, restProps)}
        >
          <div
            aria-hidden
            data-part={nextAppBarAnatomy.background}
            className={classNames.background}
          />
          {children}
        </NextAppBarPrimitive.Root>
      </MainPropsProvider>
    </ClassNamesProvider>
  );
});
NextAppBarRoot.displayName = "NextAppBarRoot";

export interface NextAppBarLeftProps extends NextAppBarPrimitive.LeftProps {}

export const NextAppBarLeft = withContext<HTMLDivElement, NextAppBarLeftProps>(
  NextAppBarPrimitive.Left,
  "left",
);

export interface NextAppBarRightProps extends NextAppBarPrimitive.RightProps {}

export const NextAppBarRight = withContext<HTMLDivElement, NextAppBarRightProps>(
  NextAppBarPrimitive.Right,
  "right",
);

export interface NextAppBarMainProps
  extends NextAppBarMainVariantProps,
    NextAppBarPrimitive.MainProps {}

export const NextAppBarMain = withMainProvider<HTMLDivElement, NextAppBarMainProps>(
  NextAppBarPrimitive.Main,
  "root",
);

export interface NextAppBarTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NextAppBarTitle = withMainContext<HTMLSpanElement, NextAppBarTitleProps>(
  Primitive.span,
  "title",
);

export interface NextAppBarSubtitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NextAppBarSubtitle = withMainContext<HTMLSpanElement, NextAppBarSubtitleProps>(
  Primitive.span,
  "subtitle",
);

export interface NextAppBarIconButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NextAppBarIconButton = forwardRef<HTMLButtonElement, NextAppBarIconButtonProps>(
  ({ children, className, ...otherProps }, ref) => {
    const classNames = useClassNames();
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <Primitive.button
        ref={composeRefs(scaleFeedbackRef, ref)}
        type="button"
        className={clsx(classNames.iconButton, scaleFeedbackClassName, className)}
        {...otherProps}
      >
        <Slot className={classNames.icon} data-part={nextAppBarAnatomy.icon}>
          {children}
        </Slot>
      </Primitive.button>
    );
  },
);
NextAppBarIconButton.displayName = "NextAppBarIconButton";
