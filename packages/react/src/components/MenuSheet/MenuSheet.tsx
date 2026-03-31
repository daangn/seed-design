import { Drawer } from "@seed-design/react-drawer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { menuSheet, type MenuSheetVariantProps } from "@seed-design/css/recipes/menu-sheet";
import {
  menuSheetItem,
  type MenuSheetItemVariantProps,
} from "@seed-design/css/recipes/menu-sheet-item";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import clsx from "clsx";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(menuSheet);
const {
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
  ClassNamesProvider: ItemClassNamesProvider,
} = createSlotRecipeContext(menuSheetItem);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetRootProps extends MenuSheetVariantProps, Drawer.RootProps {}

export const MenuSheetRoot = withRootProvider<MenuSheetRootProps>(Drawer.Root, {
  defaultProps: {
    direction: "bottom",
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetTriggerProps extends Drawer.TriggerProps {}

export const MenuSheetTrigger = Drawer.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetPositionerProps extends Drawer.PositionerProps {}

export const MenuSheetPositioner = withContext<HTMLDivElement, MenuSheetPositionerProps>(
  Drawer.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetBackdropProps extends Drawer.BackdropProps {}

export const MenuSheetBackdrop = withContext<HTMLDivElement, MenuSheetBackdropProps>(
  Drawer.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetContentProps
  extends Drawer.ContentProps,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

export const MenuSheetContent = React.forwardRef<HTMLDivElement, MenuSheetContentProps>(
  ({ className, ...props }, ref) => {
    const [variantProps, otherProps] = menuSheetItem.splitVariantProps(props);
    const classNames = useClassNames();

    return (
      <ItemPropsProvider value={variantProps}>
        <Drawer.Content className={clsx(classNames.content, className)} ref={ref} {...otherProps} />
      </ItemPropsProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetHeader = withContext<HTMLDivElement, MenuSheetHeaderProps>(
  Drawer.Header,
  "header",
);

export interface MenuSheetTitleProps extends Drawer.TitleProps {}

export const MenuSheetTitle = withContext<HTMLHeadingElement, MenuSheetTitleProps>(
  Drawer.Title,
  "title",
);

export interface MenuSheetDescriptionProps extends Drawer.DescriptionProps {}

export const MenuSheetDescription = withContext<HTMLParagraphElement, MenuSheetDescriptionProps>(
  Drawer.Description,
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetListProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetList = withContext<HTMLDivElement, MenuSheetListProps>(Primitive.div, "list");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<MenuSheetItemVariantProps, "labelAlign"> {}

export const MenuSheetGroup = React.forwardRef<HTMLDivElement, MenuSheetGroupProps>(
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

    return (
      <ItemClassNamesProvider value={classNames}>
        <Primitive.button
          ref={ref}
          className={clsx(classNames.root, propClassName)}
          {...otherProps}
        />
      </ItemClassNamesProvider>
    );
  },
);

export interface MenuSheetItemContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetItemContent = withItemContext<HTMLDivElement, MenuSheetItemContentProps>(
  Primitive.div,
  "content",
);

export interface MenuSheetItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MenuSheetItemLabel = withItemContext<HTMLSpanElement, MenuSheetItemLabelProps>(
  Primitive.span,
  "label",
);

export interface MenuSheetItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MenuSheetItemDescription = withItemContext<
  HTMLSpanElement,
  MenuSheetItemDescriptionProps
>(Primitive.span, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuSheetFooter = withContext<HTMLDivElement, MenuSheetFooterProps>(
  Primitive.div,
  "footer",
);
