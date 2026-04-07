import { actionSheet, type ActionSheetVariantProps } from "@ride-developer/css/recipes/action-sheet";
import {
  actionSheetItem,
  type ActionSheetItemVariantProps,
} from "@ride-developer/css/recipes/action-sheet-item";
import { Dialog as DialogPrimitive, useDialogContext } from "@ride-developer/react-dialog";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import type * as React from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext } = createSlotRecipeContext(actionSheet);
const { withContext: withItemContext } = createRecipeContext(actionSheetItem);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetRootProps extends ActionSheetVariantProps, DialogPrimitive.RootProps {
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
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetRoot = withRootProvider<ActionSheetRootProps>(DialogPrimitive.Root, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetTriggerProps extends DialogPrimitive.TriggerProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetPositionerProps extends DialogPrimitive.PositionerProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetPositioner = withContext<HTMLDivElement, ActionSheetPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetBackdropProps extends DialogPrimitive.BackdropProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetBackdrop = withContext<HTMLDivElement, ActionSheetBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetContentProps extends DialogPrimitive.ContentProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetContent = withContext<HTMLDivElement, ActionSheetContentProps>(
  DialogPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetHeader = withContext<HTMLDivElement, ActionSheetHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetTitleProps extends DialogPrimitive.TitleProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetTitle = withContext<HTMLHeadingElement, ActionSheetTitleProps>(
  withStateProps(Primitive.h2),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetDescriptionProps extends DialogPrimitive.DescriptionProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetDescription = withContext<
  HTMLParagraphElement,
  ActionSheetDescriptionProps
>(withStateProps(Primitive.p), "description");

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetList = withContext<HTMLDivElement, ActionSheetListProps>(
  withStateProps(Primitive.div),
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetItemProps
  extends PrimitiveProps,
    ActionSheetItemVariantProps,
    React.HTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetItem = withItemContext<HTMLButtonElement, ActionSheetItemProps>(
  withStateProps(Primitive.button),
);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated Use `MenuSheet` instead.
 */
export interface ActionSheetCloseButtonProps extends DialogPrimitive.CloseButtonProps {}

/**
 * @deprecated Use `MenuSheet` instead.
 */
export const ActionSheetCloseButton = withContext<HTMLDivElement, ActionSheetCloseButtonProps>(
  DialogPrimitive.CloseButton,
  "closeButton",
);
