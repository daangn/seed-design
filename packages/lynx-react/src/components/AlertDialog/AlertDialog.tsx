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
import { dialog, type DialogVariantProps } from "@seed-design/lynx-css/recipes/dialog";
import clsx from "clsx";

import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { useStyleProps, type StyleProps } from "../../utils/styled";

type AlertDialogComponent<Props> = ((props: Props) => ReactElement) & {
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
  createSlotRecipeContext(dialog);

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

function useAlertDialogTransition(transition: boolean | undefined) {
  const skipAnimation = useProps()?.skipAnimation === true;

  return skipAnimation ? false : (transition ?? true);
}

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogRootProps
  extends DialogVariantProps,
    Omit<DialogPrimitiveRootProps, "show" | "defaultShow" | "onShowChange"> {
  /** Whether the alert dialog is open (controlled mode). */
  open?: boolean;
  /** Whether the alert dialog is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** Called when the alert dialog's open state changes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * @platform Lynx — wraps `@lynx-js/lynx-ui-dialog` as an alert dialog.
 * Refs, `asChild`, focus management, Escape-key dismissal, and close reasons are
 * not supported by the Lynx primitive.
 */
export const AlertDialogRoot = forwardRef<never, AlertDialogRootProps>((props, _ref) => {
  const [variantProps, restProps] = dialog.splitVariantProps(props);
  const { children, open, defaultOpen, onOpenChange, ...nativeProps } = restProps;
  const classNames = dialog(variantProps);

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
}) as AlertDialogComponent<AlertDialogRootProps>;
AlertDialogRoot.displayName = "AlertDialogRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogTriggerProps extends DialogPrimitiveTriggerProps {}

/** @platform Lynx — `asChild` and refs are unsupported. */
export const AlertDialogTrigger = forwardRef<never, AlertDialogTriggerProps>((props, _ref) => {
  const { children, transition, ...nativeProps } = props;
  const resolvedTransition = useAlertDialogTransition(transition);

  return (
    <DialogTriggerPrimitive {...nativeProps} transition={resolvedTransition}>
      {children}
    </DialogTriggerPrimitive>
  );
}) as AlertDialogComponent<AlertDialogTriggerProps>;
AlertDialogTrigger.displayName = "AlertDialogTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogPositionerProps extends DialogPrimitiveViewProps {}

/** @platform Lynx — maps to `DialogView`; refs are unsupported. */
export const AlertDialogPositioner = forwardRef<never, AlertDialogPositionerProps>(
  (props, _ref) => {
    const { children, className, container, style, transition, ...nativeProps } = props;
    const classNames = useClassNames();
    const resolvedTransition = useAlertDialogTransition(transition);
    const positionerStyle = container ? { width: "100%", height: "100%", ...style } : style;

    return (
      <DialogViewPrimitive
        {...nativeProps}
        container={container}
        className={clsx(classNames.positioner, className)}
        style={positionerStyle}
        transition={resolvedTransition}
      >
        {children}
      </DialogViewPrimitive>
    );
  },
) as AlertDialogComponent<AlertDialogPositionerProps>;
AlertDialogPositioner.displayName = "AlertDialogPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogBackdropProps extends DialogPrimitiveBackdropProps {}

/**
 * @platform Lynx — refs are unsupported. Native lifecycle handlers in
 * `dialogBackdropProps` are reserved by the headless primitive and are omitted.
 * Alert dialogs do not dismiss when the backdrop is tapped by default.
 */
export const AlertDialogBackdrop = forwardRef<never, AlertDialogBackdropProps>((props, _ref) => {
  const {
    children,
    className,
    transition,
    clickToClose = false,
    dialogBackdropProps,
    ...nativeProps
  } = props;
  const classNames = useClassNames();
  const resolvedTransition = useAlertDialogTransition(transition);

  return (
    <DialogBackdropPrimitive
      {...nativeProps}
      className={clsx(classNames.backdrop, className)}
      transition={resolvedTransition}
      clickToClose={clickToClose}
      dialogBackdropProps={omitHeadlessLifecycleHandlers(dialogBackdropProps)}
    >
      {children}
    </DialogBackdropPrimitive>
  );
}) as AlertDialogComponent<AlertDialogBackdropProps>;
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogContentProps
  extends DialogPrimitiveContentProps,
    LynxAccessibilityProps {}

/**
 * @platform Lynx — refs are unsupported. Native lifecycle handlers in
 * `dialogContentProps` are reserved by the headless primitive and are omitted.
 */
export const AlertDialogContent = forwardRef<never, AlertDialogContentProps>((props, _ref) => {
  const {
    children,
    className,
    transition,
    dialogContentProps,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "alertdialog",
    ...nativeProps
  } = props;
  const classNames = useClassNames();
  const resolvedTransition = useAlertDialogTransition(transition);
  const resolvedDialogContentProps = {
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    ...omitHeadlessLifecycleHandlers(dialogContentProps),
  };

  return (
    <DialogContentPrimitive
      {...nativeProps}
      className={clsx(classNames.content, className)}
      transition={resolvedTransition}
      dialogContentProps={resolvedDialogContentProps}
    >
      {children}
    </DialogContentPrimitive>
  );
}) as AlertDialogComponent<AlertDialogContentProps>;
AlertDialogContent.displayName = "AlertDialogContent";

////////////////////////////////////////////////////////////////////////////////////
// Local slots
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogHeaderProps extends StyleProps, LynxStyledElementProps {}

export const AlertDialogHeader: LynxForwardRefComponent<unknown, AlertDialogHeaderProps> =
  forwardRef<unknown, AlertDialogHeaderProps>((props, ref) => {
    const { style, restProps } = useStyleProps(props);
    const { children, className, ...nativeProps } = restProps;
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
AlertDialogHeader.displayName = "AlertDialogHeader";

export interface AlertDialogTitleProps
  extends StyleProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const AlertDialogTitle: LynxForwardRefComponent<unknown, AlertDialogTitleProps> = forwardRef<
  unknown,
  AlertDialogTitleProps
>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const {
    children,
    className,
    "accessibility-heading": accessibilityHeading = true,
    ...nativeProps
  } = restProps;
  const classNames = useClassNames();

  return (
    <text
      {...(ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {})}
      {...nativeProps}
      className={clsx(classNames.title, className)}
      style={style as never}
      accessibility-heading={accessibilityHeading}
    >
      {children}
    </text>
  );
});
AlertDialogTitle.displayName = "AlertDialogTitle";

export interface AlertDialogDescriptionProps
  extends StyleProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const AlertDialogDescription: LynxForwardRefComponent<unknown, AlertDialogDescriptionProps> =
  forwardRef<unknown, AlertDialogDescriptionProps>((props, ref) => {
    const { style, restProps } = useStyleProps(props);
    const { children, className, ...nativeProps } = restProps;
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
AlertDialogDescription.displayName = "AlertDialogDescription";

export interface AlertDialogFooterProps extends StyleProps, LynxStyledElementProps {}

export const AlertDialogFooter: LynxForwardRefComponent<unknown, AlertDialogFooterProps> =
  forwardRef<unknown, AlertDialogFooterProps>((props, ref) => {
    const { style, restProps } = useStyleProps(props);
    const { children, className, ...nativeProps } = restProps;
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
AlertDialogFooter.displayName = "AlertDialogFooter";

////////////////////////////////////////////////////////////////////////////////////
// Action
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogActionProps extends DialogPrimitiveCloseProps {}

/** @platform Lynx — maps to `DialogClose`; `asChild` and refs are unsupported. */
export const AlertDialogAction = forwardRef<never, AlertDialogActionProps>((props, _ref) => {
  const { children, className, transition, ...nativeProps } = props;
  const classNames = useClassNames();
  const resolvedTransition = useAlertDialogTransition(transition);

  return (
    <DialogClosePrimitive
      {...nativeProps}
      className={clsx(classNames.action, className)}
      transition={resolvedTransition}
    >
      {children}
    </DialogClosePrimitive>
  );
}) as AlertDialogComponent<AlertDialogActionProps>;
AlertDialogAction.displayName = "AlertDialogAction";
