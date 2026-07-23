import { bottomSheetHandle } from "@seed-design/css/recipes/bottom-sheet-handle";
import { menuSheet, type MenuSheetVariantProps } from "@seed-design/css/recipes/menu-sheet";
import {
  menuSheetItem,
  type MenuSheetItemVariantProps,
} from "@seed-design/css/recipes/menu-sheet-item";
import { Drawer } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { usePressScale } from "../../utils/pressScale";

const { withContext, useClassNames, ClassNamesProvider } = createSlotRecipeContext(menuSheet);
const {
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
  ClassNamesProvider: ItemClassNamesProvider,
} = createSlotRecipeContext(menuSheetItem);

////////////////////////////////////////////////////////////////////////////////////

// Allowlist only the Drawer props that fit a bottom menu sheet, so the public surface
// stays stable if Drawer changes or its implementation is swapped later. Intentionally
// left out: `direction` (forced "bottom" below so the bottom-only recipe transform holds),
// `dismissible` (no default close button → would trap users), and `modal` (omitted so it
// stays at Drawer's default `true`, keeping the focus trap and aria-modal contract on the
// action list).
export interface SwipeableMenuSheetRootProps
  extends MenuSheetVariantProps,
    Pick<
      Drawer.RootProps,
      | "children"
      | "open"
      | "defaultOpen"
      | "onOpenChange"
      | "closeOnEscape"
      | "closeOnInteractOutside"
      | "lazyMount"
      | "unmountOnExit"
      | "onAnimationEnd"
    > {}

// Forces `direction="bottom"` so the bottom-only recipe transform isn't broken.
export function SwipeableMenuSheetRoot(props: SwipeableMenuSheetRootProps) {
  const [variantProps, otherProps] = menuSheet.splitVariantProps({
    lazyMount: true,
    unmountOnExit: true,
    ...props,
  });
  const classNames = menuSheet(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <Drawer.Root {...otherProps} direction="bottom" />
    </ClassNamesProvider>
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetTriggerProps extends Drawer.TriggerProps {}

export const SwipeableMenuSheetTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetPositionerProps extends Drawer.PositionerProps {}

export const SwipeableMenuSheetPositioner = withContext<
  HTMLDivElement,
  SwipeableMenuSheetPositionerProps
>(Drawer.Positioner, "positioner");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetBackdropProps extends Drawer.BackdropProps {}

export const SwipeableMenuSheetBackdrop = withContext<
  HTMLDivElement,
  SwipeableMenuSheetBackdropProps
>(Drawer.Backdrop, "backdrop");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetContentProps
  extends Drawer.ContentProps,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

export const SwipeableMenuSheetContent = React.forwardRef<
  HTMLDivElement,
  SwipeableMenuSheetContentProps
>(({ className, ...props }, ref) => {
  const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
  const classNames = useClassNames();

  return (
    <ItemPropsProvider value={variantProps}>
      <Drawer.Content ref={ref} className={clsx(classNames.content, className)} {...otherProps} />
    </ItemPropsProvider>
  );
});

SwipeableMenuSheetContent.displayName = "SwipeableMenuSheetContent";

////////////////////////////////////////////////////////////////////////////////////

// `preventCycle` only applies when snap points are configured, and
// SwipeableMenuSheet omits snap points from its Root API.
export interface SwipeableMenuSheetHandleProps
  extends PrimitiveProps,
    Omit<Drawer.HandleProps, "preventCycle"> {}

export const SwipeableMenuSheetHandle = React.forwardRef<
  HTMLDivElement,
  SwipeableMenuSheetHandleProps
>(({ className, ...props }, ref) => {
  const classNames = bottomSheetHandle();

  return (
    <Drawer.Handle ref={ref} className={clsx(classNames.root, className)} {...props}>
      <Primitive.div aria-hidden="true" className={classNames.touchArea} />
    </Drawer.Handle>
  );
});

SwipeableMenuSheetHandle.displayName = "SwipeableMenuSheetHandle";

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetHeaderProps extends Drawer.HeaderProps {}

export const SwipeableMenuSheetHeader = withContext<HTMLDivElement, SwipeableMenuSheetHeaderProps>(
  Drawer.Header,
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetTitleProps extends Drawer.TitleProps {}

export const SwipeableMenuSheetTitle = withContext<
  HTMLHeadingElement,
  SwipeableMenuSheetTitleProps
>(Drawer.Title, "title");

SwipeableMenuSheetTitle.displayName = "SwipeableMenuSheetTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetDescriptionProps extends Drawer.DescriptionProps {}

export const SwipeableMenuSheetDescription = withContext<
  HTMLParagraphElement,
  SwipeableMenuSheetDescriptionProps
>(Drawer.Description, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetListProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SwipeableMenuSheetList = withContext<HTMLDivElement, SwipeableMenuSheetListProps>(
  Primitive.div,
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement>,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

export const SwipeableMenuSheetGroup = React.forwardRef<
  HTMLDivElement,
  SwipeableMenuSheetGroupProps
>(({ className, ...props }, ref) => {
  const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
  const parentProps = useItemProps();
  const classNames = useClassNames();

  return (
    <ItemPropsProvider value={{ ...parentProps, ...variantProps }}>
      <Primitive.div className={clsx(classNames.group, className)} ref={ref} {...otherProps} />
    </ItemPropsProvider>
  );
});

SwipeableMenuSheetGroup.displayName = "SwipeableMenuSheetGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetItemProps
  extends PrimitiveProps,
    MenuSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SwipeableMenuSheetItem = React.forwardRef<
  HTMLButtonElement,
  SwipeableMenuSheetItemProps
>(({ className: propClassName, ...props }, ref) => {
  const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
  const parentProps = useItemProps();
  const classNames = menuSheetItem({ ...parentProps, ...variantProps });
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <ItemClassNamesProvider value={classNames}>
      <Primitive.button
        ref={useComposedRefs(pressScaleRef, ref)}
        className={clsx(classNames.root, pressScaleClassName, propClassName)}
        {...otherProps}
      />
    </ItemClassNamesProvider>
  );
});

SwipeableMenuSheetItem.displayName = "SwipeableMenuSheetItem";

export interface SwipeableMenuSheetItemContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SwipeableMenuSheetItemContent = withItemContext<
  HTMLDivElement,
  SwipeableMenuSheetItemContentProps
>(Primitive.div, "content");

export interface SwipeableMenuSheetItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SwipeableMenuSheetItemLabel = withItemContext<
  HTMLSpanElement,
  SwipeableMenuSheetItemLabelProps
>(Primitive.span, "label");

export interface SwipeableMenuSheetItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SwipeableMenuSheetItemDescription = withItemContext<
  HTMLSpanElement,
  SwipeableMenuSheetItemDescriptionProps
>(Primitive.span, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SwipeableMenuSheetFooter = withContext<HTMLDivElement, SwipeableMenuSheetFooterProps>(
  Primitive.div,
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SwipeableMenuSheetCloseButtonProps extends Drawer.CloseButtonProps {}

/**
 * Visible button that closes the swipeable menu sheet.
 */
export const SwipeableMenuSheetCloseButton = withContext<
  HTMLButtonElement,
  SwipeableMenuSheetCloseButtonProps
>(Drawer.CloseButton, "closeButton");
