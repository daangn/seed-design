import { bottomSheetHandle } from "@seed-design/css/recipes/bottom-sheet-handle";
import { menuSheet, type MenuSheetVariantProps } from "@seed-design/css/recipes/menu-sheet";
import {
  menuSheetItem,
  type MenuSheetItemVariantProps,
} from "@seed-design/css/recipes/menu-sheet-item";
import { dataAttr, visuallyHidden } from "@seed-design/dom-utils";
import { Drawer, useDrawerContext } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(menuSheet);
const {
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
  ClassNamesProvider: ItemClassNamesProvider,
} = createSlotRecipeContext(menuSheetItem);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetRootProps
  extends MenuSheetVariantProps,
    Omit<
      Drawer.RootProps,
      | "snapPoints"
      | "activeSnapPoint"
      | "setActiveSnapPoint"
      | "fadeFromIndex"
      | "snapToSequentialPoint"
      | "direction"
      | "dismissible"
    > {}

// Forces `direction="bottom"` so the bottom-only recipe transform isn't broken.
const SwipableDrawerRoot = (props: Drawer.RootProps) => (
  <Drawer.Root {...props} direction="bottom" />
);

export const SwipableMenuSheetRoot = withRootProvider<SwipableMenuSheetRootProps>(
  SwipableDrawerRoot,
  {
    defaultProps: {
      lazyMount: true,
      unmountOnExit: true,
    },
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetTriggerProps extends Drawer.TriggerProps {}

export const SwipableMenuSheetTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetPositionerProps extends Drawer.PositionerProps {}

export const SwipableMenuSheetPositioner = withContext<
  HTMLDivElement,
  SwipableMenuSheetPositionerProps
>(Drawer.Positioner, "positioner");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetBackdropProps extends Drawer.BackdropProps {}

export const SwipableMenuSheetBackdrop = withContext<
  HTMLDivElement,
  SwipableMenuSheetBackdropProps
>(Drawer.Backdrop, "backdrop");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetContentProps
  extends Drawer.ContentProps,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

export const SwipableMenuSheetContent = React.forwardRef<
  HTMLDivElement,
  SwipableMenuSheetContentProps
>(({ className, ...props }, ref) => {
  const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
  const classNames = useClassNames();

  return (
    <ItemPropsProvider value={variantProps}>
      <Drawer.Content ref={ref} className={clsx(classNames.content, className)} {...otherProps} />
    </ItemPropsProvider>
  );
});

SwipableMenuSheetContent.displayName = "SwipableMenuSheetContent";

////////////////////////////////////////////////////////////////////////////////////

// `preventCycle` only applies when snap points are configured, and
// SwipableMenuSheet omits snap points from its Root API.
export interface SwipableMenuSheetHandleProps
  extends PrimitiveProps,
    Omit<Drawer.HandleProps, "preventCycle"> {}

export const SwipableMenuSheetHandle = React.forwardRef<
  HTMLDivElement,
  SwipableMenuSheetHandleProps
>(({ className, ...props }, ref) => {
  const classNames = bottomSheetHandle();

  return (
    <Drawer.Handle ref={ref} className={clsx(classNames.root, className)} {...props}>
      <Primitive.div aria-hidden="true" className={classNames.touchArea} />
    </Drawer.Handle>
  );
});

SwipableMenuSheetHandle.displayName = "SwipableMenuSheetHandle";

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetHeaderProps extends Drawer.HeaderProps {}

export const SwipableMenuSheetHeader = withContext<HTMLDivElement, SwipableMenuSheetHeaderProps>(
  Drawer.Header,
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetTitleProps extends Drawer.TitleProps {}

export const SwipableMenuSheetTitle = withContext<HTMLHeadingElement, SwipableMenuSheetTitleProps>(
  React.forwardRef<HTMLHeadingElement, SwipableMenuSheetTitleProps>((props, ref) => {
    const { isCloseButtonRendered } = useDrawerContext();

    return (
      <Drawer.Title ref={ref} data-show-close-button={dataAttr(isCloseButtonRendered)} {...props} />
    );
  }),
  "title",
);

SwipableMenuSheetTitle.displayName = "SwipableMenuSheetTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetDescriptionProps extends Drawer.DescriptionProps {}

export const SwipableMenuSheetDescription = withContext<
  HTMLParagraphElement,
  SwipableMenuSheetDescriptionProps
>(Drawer.Description, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetListProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SwipableMenuSheetList = withContext<HTMLDivElement, SwipableMenuSheetListProps>(
  Primitive.div,
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement>,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

export const SwipableMenuSheetGroup = React.forwardRef<HTMLDivElement, SwipableMenuSheetGroupProps>(
  ({ className, ...props }, ref) => {
    const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
    const parentProps = useItemProps();
    const classNames = useClassNames();

    return (
      <ItemPropsProvider value={{ ...parentProps, ...variantProps }}>
        <Primitive.div className={clsx(classNames.group, className)} ref={ref} {...otherProps} />
      </ItemPropsProvider>
    );
  },
);

SwipableMenuSheetGroup.displayName = "SwipableMenuSheetGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetItemProps
  extends PrimitiveProps,
    MenuSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SwipableMenuSheetItem = React.forwardRef<
  HTMLButtonElement,
  SwipableMenuSheetItemProps
>(({ className: propClassName, ...props }, ref) => {
  const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
  const parentProps = useItemProps();
  const classNames = menuSheetItem({ ...parentProps, ...variantProps });

  return (
    <ItemClassNamesProvider value={classNames}>
      <Primitive.button
        ref={ref}
        className={clsx(classNames.root, propClassName)}
        {...otherProps}
      />
    </ItemClassNamesProvider>
  );
});

SwipableMenuSheetItem.displayName = "SwipableMenuSheetItem";

export interface SwipableMenuSheetItemContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SwipableMenuSheetItemContent = withItemContext<
  HTMLDivElement,
  SwipableMenuSheetItemContentProps
>(Primitive.div, "content");

export interface SwipableMenuSheetItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SwipableMenuSheetItemLabel = withItemContext<
  HTMLSpanElement,
  SwipableMenuSheetItemLabelProps
>(Primitive.span, "label");

export interface SwipableMenuSheetItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SwipableMenuSheetItemDescription = withItemContext<
  HTMLSpanElement,
  SwipableMenuSheetItemDescriptionProps
>(Primitive.span, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipableMenuSheetHiddenCloseButtonProps extends Drawer.CloseButtonProps {}

/**
 * Visually hidden button that closes the swipable menu sheet (for screen readers).
 */
export const SwipableMenuSheetHiddenCloseButton = React.forwardRef<
  HTMLButtonElement,
  SwipableMenuSheetHiddenCloseButtonProps
>(({ style, ...otherProps }, ref) => (
  <Drawer.CloseButton ref={ref} style={{ ...visuallyHidden, ...style }} {...otherProps} />
));

SwipableMenuSheetHiddenCloseButton.displayName = "SwipableMenuSheetHiddenCloseButton";
