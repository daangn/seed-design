import {
  DialogBackdrop as HeadlessDialogBackdrop,
  DialogCloseButton as HeadlessDialogCloseButton,
  DialogContent as HeadlessDialogContent,
  DialogDescription as HeadlessDialogDescription,
  DialogPositioner as HeadlessDialogPositioner,
  DialogRoot as HeadlessDialogRoot,
  DialogTitle as HeadlessDialogTitle,
  DialogTrigger as HeadlessDialogTrigger,
  type DialogBackdropProps as HeadlessDialogBackdropProps,
  type DialogCloseButtonProps as HeadlessDialogCloseButtonProps,
  type DialogContentProps as HeadlessDialogContentProps,
  type DialogPositionerProps as HeadlessDialogPositionerProps,
  type DialogRootProps as HeadlessDialogRootProps,
  type DialogTriggerProps as HeadlessDialogTriggerProps,
} from "@seed-design/lynx-react-dialog";
import {
  forwardRef,
  useMemo,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactElement,
  type RefAttributes,
} from "@lynx-js/react";
import { dialog, type DialogVariantProps } from "@seed-design/lynx-css/recipes/dialog";
import clsx from "clsx";

import type { LynxAccessibilityProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { useStyleProps, type StyleProps } from "../../utils/styled";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
type DialogComponent<Props> = ((props: Props) => ReactElement) & {
  displayName?: string;
};
type LynxForwardRefComponent<T, Props> = ForwardRefExoticComponent<
  PropsWithoutRef<Props> & RefAttributes<T>
>;

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(dialog);

// SEED recipe animates the `ui-entering`/`ui-open`/`ui-closed` classes, so parts opt into
// lynx-ui transition classes by default. Root `skipAnimation` turns them off in the headless parts.

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps
  extends DialogVariantProps,
    Omit<HeadlessDialogRootProps, keyof DialogVariantProps> {}

/**
 * @platform Lynx — `@seed-design/lynx-react-dialog` 위에 SEED recipe를 조립한다.
 *
 * Unlike the React Dialog primitive, Lynx does not support refs, `lazyMount`,
 * `unmountOnExit`, focus management, title/description associations, Escape-key
 * dismissal, `asChild`, or close-reason details. Use `forceMount` from the
 * underlying Lynx dialog when content must remain mounted while closed.
 */
export const DialogRoot = forwardRef<never, DialogRootProps>((props, _ref) => {
  const [variantProps, restProps] = dialog.splitVariantProps(props);
  const { children, ...rootProps } = restProps;
  const { size, skipAnimation } = variantProps;
  // variantProps is a new object on every render, so memoize on the variant values.
  const classNames = useMemo(() => dialog({ size, skipAnimation }), [size, skipAnimation]);

  return (
    <ClassNamesProvider value={classNames}>
      <HeadlessDialogRoot {...rootProps} skipAnimation={skipAnimation === true}>
        {children}
      </HeadlessDialogRoot>
    </ClassNamesProvider>
  );
}) as DialogComponent<DialogRootProps>;
DialogRoot.displayName = "DialogRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface DialogTriggerProps extends HeadlessDialogTriggerProps {}

/**
 * @platform Lynx — `asChild` and refs are unsupported.
 */
export const DialogTrigger = forwardRef<never, DialogTriggerProps>((props, _ref) => {
  const { transition = true, ...triggerProps } = props;

  return <HeadlessDialogTrigger {...triggerProps} transition={transition} />;
}) as DialogComponent<DialogTriggerProps>;
DialogTrigger.displayName = "DialogTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface DialogPositionerProps extends HeadlessDialogPositionerProps {}

/**
 * @platform Lynx — maps to `DialogView`; refs are unsupported.
 */
export const DialogPositioner = forwardRef<never, DialogPositionerProps>((props, _ref) => {
  const { className, transition = true, ...positionerProps } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogPositioner
      {...positionerProps}
      className={clsx(classNames.positioner, className)}
      transition={transition}
    />
  );
}) as DialogComponent<DialogPositionerProps>;
DialogPositioner.displayName = "DialogPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop
////////////////////////////////////////////////////////////////////////////////////

export interface DialogBackdropProps extends HeadlessDialogBackdropProps {}

/**
 * @platform Lynx — refs are unsupported. Presence handlers and `bindtap` in
 * `dialogBackdropProps` are reserved for the dialog. `onClick` is called only when a tap
 * closes the dialog, so it does not fire while `clickToClose` is `false`.
 */
export const DialogBackdrop = forwardRef<never, DialogBackdropProps>((props, _ref) => {
  const { className, transition = true, ...backdropProps } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogBackdrop
      {...backdropProps}
      className={clsx(classNames.backdrop, className)}
      transition={transition}
    />
  );
}) as DialogComponent<DialogBackdropProps>;
DialogBackdrop.displayName = "DialogBackdrop";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface DialogContentProps extends HeadlessDialogContentProps {}

/**
 * @platform Lynx — refs are unsupported. Presence handlers in `dialogContentProps`
 * are reserved for the dialog; other native props and callbacks are forwarded.
 */
export const DialogContent = forwardRef<never, DialogContentProps>((props, _ref) => {
  const { className, transition = true, ...contentProps } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogContent
      {...contentProps}
      className={clsx(classNames.content, className)}
      transition={transition}
    />
  );
}) as DialogComponent<DialogContentProps>;
DialogContent.displayName = "DialogContent";

////////////////////////////////////////////////////////////////////////////////////
// Local slots
////////////////////////////////////////////////////////////////////////////////////

export interface DialogHeaderProps extends StyleProps, LynxStyledElementProps {}

export const DialogHeader: LynxForwardRefComponent<unknown, DialogHeaderProps> = forwardRef<
  unknown,
  DialogHeaderProps
>((props, ref) => {
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
DialogHeader.displayName = "DialogHeader";

export interface DialogBodyProps extends StyleProps, LynxStyledElementProps {}

export const DialogBody: LynxForwardRefComponent<unknown, DialogBodyProps> = forwardRef<
  unknown,
  DialogBodyProps
>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const { children, className, ...nativeProps } = restProps;
  const classNames = useClassNames();

  return (
    <scroll-view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      {...nativeProps}
      scroll-y
      className={clsx(classNames.body, className)}
      style={style}
    >
      {children}
    </scroll-view>
  );
});
DialogBody.displayName = "DialogBody";

export interface DialogTitleProps
  extends StyleProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  /**
   * @defaultValue true
   */
  "accessibility-heading"?: LynxAccessibilityProps["accessibility-heading"];
}

export const DialogTitle: LynxForwardRefComponent<unknown, DialogTitleProps> = forwardRef<
  unknown,
  DialogTitleProps
>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
  const { className, ...titleProps } = restProps;
  const classNames = useClassNames();

  return (
    <HeadlessDialogTitle
      ref={ref}
      {...titleProps}
      className={clsx(classNames.title, className)}
      style={style as never}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps extends StyleProps, LynxStyledElementProps {}

export const DialogDescription: LynxForwardRefComponent<unknown, DialogDescriptionProps> =
  forwardRef<unknown, DialogDescriptionProps>((props, ref) => {
    const { style, restProps } = useStyleProps(props);
    const { className, ...descriptionProps } = restProps;
    const classNames = useClassNames();

    return (
      <HeadlessDialogDescription
        ref={ref}
        {...descriptionProps}
        className={clsx(classNames.description, className)}
        style={style as never}
      />
    );
  });
DialogDescription.displayName = "DialogDescription";

export interface DialogFooterProps extends StyleProps, LynxStyledElementProps {}

export const DialogFooter: LynxForwardRefComponent<unknown, DialogFooterProps> = forwardRef<
  unknown,
  DialogFooterProps
>((props, ref) => {
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
DialogFooter.displayName = "DialogFooter";

////////////////////////////////////////////////////////////////////////////////////
// Action
////////////////////////////////////////////////////////////////////////////////////

export interface DialogActionProps extends HeadlessDialogCloseButtonProps {}

/**
 * @platform Lynx — maps to `DialogClose`; `asChild` and refs are unsupported.
 */
export const DialogAction = forwardRef<never, DialogActionProps>((props, _ref) => {
  const { className, transition = true, ...closeProps } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogCloseButton
      {...closeProps}
      className={clsx(classNames.action, className)}
      transition={transition}
    />
  );
}) as DialogComponent<DialogActionProps>;
DialogAction.displayName = "DialogAction";
