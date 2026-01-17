import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { menuSheet, type MenuSheetVariantProps } from "@seed-design/css/recipes/menu-sheet";
import {
  menuSheetItem,
  type MenuSheetItemVariantProps,
} from "@seed-design/css/recipes/menu-sheet-item";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(menuSheet);
const {
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
} = createSlotRecipeContext(menuSheetItem);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

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

export const MenuSheetRoot = withRootProvider<MenuSheetRootProps>(DialogPrimitive.Root, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetTriggerProps extends DialogPrimitive.TriggerProps {}

export const MenuSheetTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetPositionerProps extends DialogPrimitive.PositionerProps {}

export const MenuSheetPositioner = withContext<HTMLDivElement, MenuSheetPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetBackdropProps extends DialogPrimitive.BackdropProps {}

export const MenuSheetBackdrop = withContext<HTMLDivElement, MenuSheetBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetContentProps
  extends DialogPrimitive.ContentProps,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

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

export interface MenuSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetHeader = withContext<HTMLDivElement, MenuSheetHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetTitleProps extends DialogPrimitive.TitleProps {}

export const MenuSheetTitle = withContext<HTMLHeadingElement, MenuSheetTitleProps>(
  withStateProps(Primitive.h2),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetListProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetList = withContext<HTMLDivElement, MenuSheetListProps>(
  withStateProps(Primitive.div),
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

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

export interface MenuSheetItemProps
  extends PrimitiveProps,
    MenuSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const MenuSheetItem = React.forwardRef<HTMLButtonElement, MenuSheetItemProps>(
  ({ className: propClassName, ...props }, ref) => {
    const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
    const parentProps = useItemProps();

    const classNames = menuSheetItem({ ...parentProps, ...variantProps });
    const { stateProps } = useDialogContext();

    return (
      <Primitive.button
        ref={ref}
        className={clsx(classNames.root, propClassName)}
        {...stateProps}
        {...otherProps}
      />
    );
  },
);

export interface MenuSheetItemContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetItemContent = withItemContext<HTMLDivElement, MenuSheetItemContentProps>(
  withStateProps(Primitive.div),
  "content",
);

export interface MenuSheetItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MenuSheetItemLabel = withItemContext<HTMLSpanElement, MenuSheetItemLabelProps>(
  withStateProps(Primitive.span),
  "label",
);

export interface MenuSheetItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MenuSheetItemDescription = withItemContext<
  HTMLSpanElement,
  MenuSheetItemDescriptionProps
>(withStateProps(Primitive.span), "description");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetFooter = withContext<HTMLDivElement, MenuSheetFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

export const MenuSheetCloseButton = withContext<HTMLDivElement, MenuSheetCloseButtonProps>(
  DialogPrimitive.CloseButton,
  "closeButton",
);
