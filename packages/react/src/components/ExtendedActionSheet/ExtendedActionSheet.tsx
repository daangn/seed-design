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

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetRootProps
  extends ExtendedActionSheetVariantProps,
    DialogPrimitive.RootProps {
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

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetTriggerProps extends DialogPrimitive.TriggerProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetPositionerProps extends DialogPrimitive.PositionerProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetPositioner = withContext<
  HTMLDivElement,
  ExtendedActionSheetPositionerProps
>(DialogPrimitive.Positioner, "positioner");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetBackdropProps extends DialogPrimitive.BackdropProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetBackdrop = withContext<
  HTMLDivElement,
  ExtendedActionSheetBackdropProps
>(DialogPrimitive.Backdrop, "backdrop");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetContentProps extends DialogPrimitive.ContentProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetContent = withContext<
  HTMLDivElement,
  ExtendedActionSheetContentProps
>(DialogPrimitive.Content, "content");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetHeader = withContext<
  HTMLDivElement,
  ExtendedActionSheetHeaderProps
>(withStateProps(Primitive.div), "header");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetTitleProps extends DialogPrimitive.TitleProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetTitle = withContext<
  HTMLHeadingElement,
  ExtendedActionSheetTitleProps
>(withStateProps(Primitive.h2), "title");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetListProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetList = withContext<HTMLDivElement, ExtendedActionSheetListProps>(
  withStateProps(Primitive.div),
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetGroup = withContext<HTMLDivElement, ExtendedActionSheetGroupProps>(
  withStateProps(Primitive.div),
  "group",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetItemProps
  extends PrimitiveProps,
    ExtendedActionSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetItem = withItemContext<
  HTMLButtonElement,
  ExtendedActionSheetItemProps
>(withStateProps(Primitive.button));

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetFooter = withContext<
  HTMLDivElement,
  ExtendedActionSheetFooterProps
>(withStateProps(Primitive.div), "footer");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export interface ExtendedActionSheetCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

/**
 * @deprecated Use `SwipeableMenuSheet` instead.
 */
export const ExtendedActionSheetCloseButton = withContext<
  HTMLDivElement,
  ExtendedActionSheetCloseButtonProps
>(DialogPrimitive.CloseButton, "closeButton");
