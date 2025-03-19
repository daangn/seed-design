import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  extendedActionSheet,
  type ExtendedActionSheetVariantProps,
} from "@seed-design/css/recipes/extended-action-sheet";
import {
  extendedActionSheetItem,
  type ExtendedActionSheetItemVariantProps,
} from "@seed-design/css/recipes/extended-action-sheet-item";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext } = createSlotRecipeContext(extendedActionSheet);
const { withContext: withItemContext } = createRecipeContext(extendedActionSheetItem);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetRootProps
  extends ExtendedActionSheetVariantProps,
    DialogPrimitive.RootProps {}

export const ExtendedActionSheetRoot = withRootProvider<ExtendedActionSheetRootProps>(
  DialogPrimitive.Root,
  {
    defaultProps: {
      lazyMount: true,
      unmountOnExit: true,
    },
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetTriggerProps extends DialogPrimitive.TriggerProps {}

export const ExtendedActionSheetTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetPositionerProps extends DialogPrimitive.PositionerProps {}

export const ExtendedActionSheetPositioner = withContext<
  HTMLDivElement,
  ExtendedActionSheetPositionerProps
>(DialogPrimitive.Positioner, "positioner");

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetBackdropProps extends DialogPrimitive.BackdropProps {}

export const ExtendedActionSheetBackdrop = withContext<
  HTMLDivElement,
  ExtendedActionSheetBackdropProps
>(DialogPrimitive.Backdrop, "backdrop");

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetContentProps extends DialogPrimitive.ContentProps {}

export const ExtendedActionSheetContent = withContext<
  HTMLDivElement,
  ExtendedActionSheetContentProps
>(DialogPrimitive.Content, "content");

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ExtendedActionSheetHeader = withContext<
  HTMLDivElement,
  ExtendedActionSheetHeaderProps
>(withStateProps(Primitive.div), "header");

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetTitleProps extends DialogPrimitive.TitleProps {}

export const ExtendedActionSheetTitle = withContext<
  HTMLHeadingElement,
  ExtendedActionSheetTitleProps
>(withStateProps(Primitive.h2), "title");

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetListProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ExtendedActionSheetList = withContext<HTMLDivElement, ExtendedActionSheetListProps>(
  withStateProps(Primitive.div),
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ExtendedActionSheetGroup = withContext<HTMLDivElement, ExtendedActionSheetGroupProps>(
  withStateProps(Primitive.div),
  "group",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetItemProps
  extends PrimitiveProps,
    ExtendedActionSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const ExtendedActionSheetItem = withItemContext<
  HTMLButtonElement,
  ExtendedActionSheetItemProps
>(withStateProps(Primitive.button));

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ExtendedActionSheetFooter = withContext<
  HTMLDivElement,
  ExtendedActionSheetFooterProps
>(withStateProps(Primitive.div), "footer");

////////////////////////////////////////////////////////////////////////////////////

export interface ExtendedActionSheetCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

export const ExtendedActionSheetCloseButton = withContext<
  HTMLDivElement,
  ExtendedActionSheetCloseButtonProps
>(DialogPrimitive.CloseButton, "closeButton");
