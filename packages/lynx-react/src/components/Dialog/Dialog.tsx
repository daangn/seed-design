import {
  DialogBackdrop as DialogBackdropPrimitive,
  DialogClose as DialogClosePrimitive,
  DialogContent as DialogContentPrimitive,
  DialogRoot as DialogRootPrimitive,
  DialogTrigger as DialogTriggerPrimitive,
  DialogView as DialogViewPrimitive,
  type DialogBackdropProps as DialogPrimitiveBackdropProps,
  type DialogCloseProps as DialogPrimitiveCloseProps,
  type DialogContentProps as DialogPrimitiveContentProps,
  type DialogRootProps as DialogPrimitiveRootProps,
  type DialogTriggerProps as DialogPrimitiveTriggerProps,
  type DialogViewProps as DialogPrimitiveViewProps,
} from "@lynx-js/lynx-ui-dialog";
import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactElement,
  type RefAttributes,
} from "@lynx-js/react";
import {
  contentDialog,
  type ContentDialogVariantProps,
} from "@seed-design/lynx-css/recipes/content-dialog";
import clsx from "clsx";

import type { LynxStyledElementProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

type DialogComponent<Props> = ((props: Props) => ReactElement) & {
  displayName?: string;
};
type LynxForwardRefComponent<T, Props> = ForwardRefExoticComponent<
  PropsWithoutRef<Props> & RefAttributes<T>
>;

type NativeLifecycleHandlers = {
  bindanimationstart?: unknown;
  bindanimationend?: unknown;
  bindanimationcancel?: unknown;
  bindtransitionstart?: unknown;
  bindtransitionend?: unknown;
  bindtap?: unknown;
};

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(contentDialog);

function omitHeadlessLifecycleHandlers<Props extends object>(
  props: Props | undefined,
): Props | undefined {
  if (!props) return props;

  const {
    bindanimationstart: _bindanimationstart,
    bindanimationend: _bindanimationend,
    bindanimationcancel: _bindanimationcancel,
    bindtransitionstart: _bindtransitionstart,
    bindtransitionend: _bindtransitionend,
    bindtap: _bindtap,
    ...nativeProps
  } = props as Props & NativeLifecycleHandlers;

  return nativeProps as Props;
}

function useDialogTransition(transition: boolean | undefined) {
  const skipAnimation = useProps()?.skipAnimation === true;

  return skipAnimation ? false : (transition ?? true);
}

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps
  extends ContentDialogVariantProps,
    Omit<DialogPrimitiveRootProps, "show" | "defaultShow" | "onShowChange"> {
  /**
   * Whether the dialog is open (controlled mode).
   * Internally mapped to `show` of `@lynx-js/lynx-ui-dialog`.
   */
  open?: boolean;
  /**
   * Whether the dialog is open by default (uncontrolled mode).
   * Internally mapped to `defaultShow`.
   * @defaultValue false
   */
  defaultOpen?: boolean;
  /**
   * Called when the dialog's open state is about to change.
   * The Lynx headless implementation provides only the next boolean state.
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * @platform Lynx — wraps `@lynx-js/lynx-ui-dialog`.
 *
 * Unlike the React Dialog primitive, Lynx does not support refs, `lazyMount`,
 * `unmountOnExit`, focus management, title/description associations, Escape-key
 * dismissal, `asChild`, or close-reason details. Use `forceMount` from the
 * underlying Lynx dialog when content must remain mounted while closed.
 */
export const DialogRoot = forwardRef<never, DialogRootProps>((props, _ref) => {
  const [variantProps, restProps] = contentDialog.splitVariantProps(props);
  const { children, open, defaultOpen, onOpenChange, ...nativeProps } = restProps;
  const classNames = contentDialog(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <PropsProvider value={variantProps}>
        <DialogRootPrimitive
          {...nativeProps}
          show={open}
          defaultShow={defaultOpen}
          onShowChange={onOpenChange}
        >
          {children}
        </DialogRootPrimitive>
      </PropsProvider>
    </ClassNamesProvider>
  );
}) as DialogComponent<DialogRootProps>;
DialogRoot.displayName = "DialogRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface DialogTriggerProps extends DialogPrimitiveTriggerProps {}

/**
 * @platform Lynx — `asChild` and refs are unsupported.
 */
export const DialogTrigger = forwardRef<never, DialogTriggerProps>((props, _ref) => {
  const { children, transition, ...nativeProps } = props;
  const resolvedTransition = useDialogTransition(transition);

  return (
    <DialogTriggerPrimitive {...nativeProps} transition={resolvedTransition}>
      {children}
    </DialogTriggerPrimitive>
  );
}) as DialogComponent<DialogTriggerProps>;
DialogTrigger.displayName = "DialogTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface DialogPositionerProps extends DialogPrimitiveViewProps {}

/**
 * @platform Lynx — maps to `DialogView`; refs are unsupported.
 */
export const DialogPositioner = forwardRef<never, DialogPositionerProps>((props, _ref) => {
  const { children, className, transition, ...nativeProps } = props;
  const classNames = useClassNames();
  const resolvedTransition = useDialogTransition(transition);

  return (
    <DialogViewPrimitive
      {...nativeProps}
      className={clsx(classNames.positioner, className)}
      transition={resolvedTransition}
    >
      {children}
    </DialogViewPrimitive>
  );
}) as DialogComponent<DialogPositionerProps>;
DialogPositioner.displayName = "DialogPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop
////////////////////////////////////////////////////////////////////////////////////

export interface DialogBackdropProps extends DialogPrimitiveBackdropProps {}

/**
 * @platform Lynx — refs are unsupported. Native lifecycle handlers in
 * `dialogBackdropProps` are reserved by the headless primitive and are omitted
 * so they cannot replace its presence and dismissal handlers.
 */
export const DialogBackdrop = forwardRef<never, DialogBackdropProps>((props, _ref) => {
  const { children, className, transition, dialogBackdropProps, ...nativeProps } = props;
  const classNames = useClassNames();
  const resolvedTransition = useDialogTransition(transition);

  return (
    <DialogBackdropPrimitive
      {...nativeProps}
      className={clsx(classNames.backdrop, className)}
      transition={resolvedTransition}
      dialogBackdropProps={omitHeadlessLifecycleHandlers(dialogBackdropProps)}
    >
      {children}
    </DialogBackdropPrimitive>
  );
}) as DialogComponent<DialogBackdropProps>;
DialogBackdrop.displayName = "DialogBackdrop";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface DialogContentProps extends DialogPrimitiveContentProps {}

/**
 * @platform Lynx — refs are unsupported. Native lifecycle handlers in
 * `dialogContentProps` are reserved by the headless primitive and are omitted
 * so they cannot replace its presence handlers.
 */
export const DialogContent = forwardRef<never, DialogContentProps>((props, _ref) => {
  const { children, className, transition, dialogContentProps, ...nativeProps } = props;
  const classNames = useClassNames();
  const resolvedTransition = useDialogTransition(transition);

  return (
    <DialogContentPrimitive
      {...nativeProps}
      className={clsx(classNames.content, className)}
      transition={resolvedTransition}
      dialogContentProps={omitHeadlessLifecycleHandlers(dialogContentProps)}
    >
      {children}
    </DialogContentPrimitive>
  );
}) as DialogComponent<DialogContentProps>;
DialogContent.displayName = "DialogContent";

////////////////////////////////////////////////////////////////////////////////////
// Local slots
////////////////////////////////////////////////////////////////////////////////////

export interface DialogHeaderProps extends LynxStyledElementProps {}

export const DialogHeader: LynxForwardRefComponent<unknown, DialogHeaderProps> = forwardRef<
  unknown,
  DialogHeaderProps
>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      {...nativeProps}
      className={clsx(classNames.header, className)}
      style={style as never}
    >
      {children}
    </view>
  );
});
DialogHeader.displayName = "DialogHeader";

export interface DialogBodyProps extends LynxStyledElementProps {}

export const DialogBody: LynxForwardRefComponent<unknown, DialogBodyProps> = forwardRef<
  unknown,
  DialogBodyProps
>((props, ref) => {
  const { children, className, style } = props;
  const classNames = useClassNames();

  return (
    <scroll-view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      scroll-y
      className={clsx(classNames.body, className)}
      style={style as never}
    >
      {children}
    </scroll-view>
  );
});
DialogBody.displayName = "DialogBody";

export interface DialogTitleProps extends LynxStyledElementProps {}

export const DialogTitle: LynxForwardRefComponent<unknown, DialogTitleProps> = forwardRef<
  unknown,
  DialogTitleProps
>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...(ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {})}
      {...nativeProps}
      className={clsx(classNames.title, className)}
      style={style as never}
    >
      {children}
    </text>
  );
});
DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps extends LynxStyledElementProps {}

export const DialogDescription: LynxForwardRefComponent<unknown, DialogDescriptionProps> =
  forwardRef<unknown, DialogDescriptionProps>((props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <text
        {...(ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {})}
        {...nativeProps}
        className={clsx(classNames.description, className)}
        style={style as never}
      >
        {children}
      </text>
    );
  });
DialogDescription.displayName = "DialogDescription";

export interface DialogFooterProps extends LynxStyledElementProps {}

export const DialogFooter: LynxForwardRefComponent<unknown, DialogFooterProps> = forwardRef<
  unknown,
  DialogFooterProps
>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      {...nativeProps}
      className={clsx(classNames.footer, className)}
      style={style as never}
    >
      {children}
    </view>
  );
});
DialogFooter.displayName = "DialogFooter";

////////////////////////////////////////////////////////////////////////////////////
// Action
////////////////////////////////////////////////////////////////////////////////////

export interface DialogActionProps extends DialogPrimitiveCloseProps {}

/**
 * @platform Lynx — maps to `DialogClose`; `asChild` and refs are unsupported.
 */
export const DialogAction = forwardRef<never, DialogActionProps>((props, _ref) => {
  const { children, className, transition, ...nativeProps } = props;
  const classNames = useClassNames();
  const resolvedTransition = useDialogTransition(transition);

  return (
    <DialogClosePrimitive
      {...nativeProps}
      className={clsx(classNames.action, className)}
      transition={resolvedTransition}
    >
      {children}
    </DialogClosePrimitive>
  );
}) as DialogComponent<DialogActionProps>;
DialogAction.displayName = "DialogAction";
