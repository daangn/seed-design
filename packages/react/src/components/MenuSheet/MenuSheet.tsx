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

export interface MenuSheetRootProps extends MenuSheetVariantProps, DialogPrimitive.RootProps {}

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
    Pick<MenuSheetItemVariantProps, "labelAlignment"> {}

export const MenuSheetContent = React.forwardRef<HTMLDivElement, MenuSheetContentProps>(
  ({ labelAlignment, children, ...props }, ref) => {
    const ContentComponent = withContext<HTMLDivElement, DialogPrimitive.ContentProps>(
      DialogPrimitive.Content,
      "content",
    );

    return (
      <ItemPropsProvider value={React.useMemo(() => ({ labelAlignment }), [labelAlignment])}>
        <ContentComponent ref={ref} {...props}>
          {children}
        </ContentComponent>
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
    Pick<MenuSheetItemVariantProps, "labelAlignment"> {}

export const MenuSheetGroup = React.forwardRef<HTMLDivElement, MenuSheetGroupProps>(
  ({ labelAlignment: overriddenLabelAlignment, children, ...props }, ref) => {
    const parentProps = useItemProps();
    const labelAlignment = overriddenLabelAlignment ?? parentProps?.labelAlignment;

    const GroupComponent = withContext<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      withStateProps(Primitive.div),
      "group",
    );

    return (
      <ItemPropsProvider value={React.useMemo(() => ({ labelAlignment }), [labelAlignment])}>
        <GroupComponent ref={ref} {...props}>
          {children}
        </GroupComponent>
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
  ({ labelAlignment: overriddenLabelAlignment, ...props }, ref) => {
    const parentProps = useItemProps();
    const labelAlignment = overriddenLabelAlignment ?? parentProps?.labelAlignment;

    const ItemComponent = withItemContext<HTMLButtonElement, MenuSheetItemProps>(
      withStateProps(Primitive.button),
    );

    return <ItemComponent ref={ref} labelAlignment={labelAlignment} {...props} />;
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
