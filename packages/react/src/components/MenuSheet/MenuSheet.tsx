import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { menuSheet, type MenuSheetVariantProps } from "@seed-design/css/recipes/menu-sheet";
import {
  menuSheetItem,
  type MenuSheetItemVariantProps,
} from "@seed-design/css/recipes/menu-sheet-item";
import * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext } = createSlotRecipeContext(menuSheet);
const {
  withContext: withItemContext,
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
} = createRecipeContext(menuSheetItem);
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

const MenuSheetContentBase = withContext<HTMLDivElement, DialogPrimitive.ContentProps>(
  DialogPrimitive.Content,
  "content",
);

export const MenuSheetContent = React.forwardRef<HTMLDivElement, MenuSheetContentProps>(
  ({ labelAlign, children, ...props }, ref) => {
    return (
      <ItemPropsProvider value={React.useMemo(() => ({ labelAlign }), [labelAlign])}>
        <MenuSheetContentBase ref={ref} {...props}>
          {children}
        </MenuSheetContentBase>
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

const MenuSheetGroupBase = withContext<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  withStateProps(Primitive.div),
  "group",
);

export const MenuSheetGroup = React.forwardRef<HTMLDivElement, MenuSheetGroupProps>(
  ({ labelAlign: overriddenLabelAlign, children, ...props }, ref) => {
    const parentProps = useItemProps();
    const labelAlign = overriddenLabelAlign ?? parentProps?.labelAlign;

    return (
      <ItemPropsProvider value={React.useMemo(() => ({ labelAlign }), [labelAlign])}>
        <MenuSheetGroupBase ref={ref} {...props}>
          {children}
        </MenuSheetGroupBase>
      </ItemPropsProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSheetItemProps
  extends PrimitiveProps,
    MenuSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

const MenuSheetItemBase = withItemContext<HTMLButtonElement, MenuSheetItemProps>(
  withStateProps(Primitive.button),
);

export const MenuSheetItem = React.forwardRef<HTMLButtonElement, MenuSheetItemProps>(
  ({ labelAlign: overriddenLabelAlign, ...props }, ref) => {
    const parentProps = useItemProps();
    const labelAlign = overriddenLabelAlign ?? parentProps?.labelAlign;

    return <MenuSheetItemBase ref={ref} labelAlign={labelAlign} {...props} />;
  },
);

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
