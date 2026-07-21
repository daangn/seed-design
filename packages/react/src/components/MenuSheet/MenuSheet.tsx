import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { menuSheet, type MenuSheetVariantProps } from "@seed-design/css/recipes/menu-sheet";
import {
  menuSheetItem,
  type MenuSheetItemVariantProps,
} from "@seed-design/css/recipes/menu-sheet-item";
import * as React from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { usePressScale, withPressScale } from "../../utils/pressScale";
import { wrapSlotChildren } from "../../utils/wrapSlotChildren";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(menuSheet);
const {
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
  ClassNamesProvider: ItemClassNamesProvider,
} = createSlotRecipeContext(menuSheetItem);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetRootProps extends MenuSheetVariantProps, DialogPrimitive.RootProps {
  /**
   * @default true
   */
  lazyMount?: DialogPrimitive.RootProps["lazyMount"];
  /**
   * @default true
   */
  unmountOnExit?: DialogPrimitive.RootProps["unmountOnExit"];
}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetRoot = withRootProvider<MenuSheetRootProps>(DialogPrimitive.Root, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetTriggerProps extends DialogPrimitive.TriggerProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetPositionerProps extends DialogPrimitive.PositionerProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetPositioner = withContext<HTMLDivElement, MenuSheetPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetBackdropProps extends DialogPrimitive.BackdropProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetBackdrop = withContext<HTMLDivElement, MenuSheetBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetContentProps
  extends DialogPrimitive.ContentProps,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetContent = React.forwardRef<HTMLDivElement, MenuSheetContentProps>(
  ({ className, ...props }, ref) => {
    const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
    const classNames = useClassNames();

    return (
      <ItemPropsProvider value={variantProps}>
        <DialogPrimitive.Content
          className={clsx(classNames.content, className)}
          ref={ref}
          {...otherProps}
        />
      </ItemPropsProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetHeader = withContext<HTMLDivElement, MenuSheetHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

// NOTE: uses DialogPrimitive.TitleProps,
// but actual rendered component is a Primitive.h2 rather than a DialogPrimitive.Title
// find out why later; h2 is same but missing and some a11y features
/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetTitleProps extends DialogPrimitive.TitleProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetTitle = withContext<HTMLHeadingElement, MenuSheetTitleProps>(
  withStateProps(Primitive.h2),
  "title",
);

// NOTE: uses DialogPrimitive.DescriptionProps,
// but actual rendered component is a Primitive.p rather than a DialogPrimitive.Description
// find out why later; p is same but missing and some a11y features
/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetDescriptionProps extends DialogPrimitive.DescriptionProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetDescription = withContext<HTMLParagraphElement, MenuSheetDescriptionProps>(
  withStateProps(Primitive.p),
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetListProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetList = withContext<HTMLDivElement, MenuSheetListProps>(
  withStateProps(Primitive.div),
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetGroup = React.forwardRef<HTMLDivElement, MenuSheetGroupProps>(
  ({ className, ...props }, ref) => {
    const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
    const parentProps = useItemProps();

    const classNames = useClassNames();
    const { stateProps } = useDialogContext();

    return (
      <ItemPropsProvider value={{ ...parentProps, ...variantProps }}>
        <Primitive.div
          className={clsx(classNames.group, className)}
          ref={ref}
          {...stateProps}
          {...otherProps}
        />
      </ItemPropsProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetItemProps
  extends PrimitiveProps,
    MenuSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetItem = React.forwardRef<HTMLButtonElement, MenuSheetItemProps>(
  ({ className: propClassName, children, ...props }, ref) => {
    const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
    const parentProps = useItemProps();

    const classNames = menuSheetItem({ ...parentProps, ...variantProps });
    const { stateProps } = useDialogContext();
    const { pressScaleRef } = usePressScale();

    return (
      <ItemClassNamesProvider value={classNames}>
        <Primitive.button
          ref={composeRefs(pressScaleRef, ref)}
          className={clsx(classNames.root, propClassName)}
          {...stateProps}
          {...otherProps}
        >
          {/* layout layer — scales as a whole on press while the pressed background
              stays on root. With asChild it is injected inside the consumer's
              element instead. */}
          {wrapSlotChildren(otherProps.asChild, children, (layoutChildren) => (
            <div className={classNames.layout}>{layoutChildren}</div>
          ))}
        </Primitive.button>
      </ItemClassNamesProvider>
    );
  },
);

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetItemContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetItemContent = withItemContext<HTMLDivElement, MenuSheetItemContentProps>(
  withStateProps(Primitive.div),
  "content",
);

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetItemLabel = withItemContext<HTMLSpanElement, MenuSheetItemLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetItemDescription = withItemContext<
  HTMLSpanElement,
  MenuSheetItemDescriptionProps
>(withStateProps(Primitive.span), "description");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetFooter = withContext<HTMLDivElement, MenuSheetFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface MenuSheetCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const MenuSheetCloseButton = withPressScale(
  withContext<HTMLDivElement, MenuSheetCloseButtonProps>(
    DialogPrimitive.CloseButton,
    "closeButton",
  ),
);
