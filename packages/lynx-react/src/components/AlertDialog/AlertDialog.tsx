import {
  DialogBackdrop as HeadlessDialogBackdrop,
  DialogCloseButton as HeadlessDialogCloseButton,
  DialogContent as HeadlessDialogContent,
  DialogPositioner as HeadlessDialogPositioner,
  DialogRoot as HeadlessDialogRoot,
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
import {
  alertDialog,
  type AlertDialogVariantProps,
} from "@seed-design/lynx-css/recipes/alert-dialog";
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

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(alertDialog);

// SEED recipe animates the `ui-entering`/`ui-open`/`ui-closed` classes, so parts opt into
// lynx-ui transition classes by default. Root `skipAnimation` turns them off in the headless parts.
// Alert semantics are defaults on top of `@seed-design/lynx-react-dialog` options:
// Backdrop `clickToClose`, Content native accessibility, and Title heading.

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogRootProps
  extends AlertDialogVariantProps,
    Omit<HeadlessDialogRootProps, keyof AlertDialogVariantProps> {}

/**
 * @platform Lynx — `@seed-design/lynx-react-dialog` 위에 alert dialog recipe를 조립한다.
 * Refs, `asChild`, focus management, Escape-key dismissal, and close reasons are
 * not supported by the Lynx primitive.
 */
export const AlertDialogRoot = forwardRef<never, AlertDialogRootProps>((props, _ref) => {
  const [variantProps, restProps] = alertDialog.splitVariantProps(props);
  const { children, ...rootProps } = restProps;
  const { skipAnimation } = variantProps;
  // variantProps is a new object on every render, so memoize on the variant value.
  const classNames = useMemo(() => alertDialog({ skipAnimation }), [skipAnimation]);

  return (
    <ClassNamesProvider value={classNames}>
      <HeadlessDialogRoot {...rootProps} skipAnimation={skipAnimation === true}>
        {children}
      </HeadlessDialogRoot>
    </ClassNamesProvider>
  );
}) as AlertDialogComponent<AlertDialogRootProps>;
AlertDialogRoot.displayName = "AlertDialogRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogTriggerProps extends HeadlessDialogTriggerProps {}

/** @platform Lynx — `asChild` and refs are unsupported. */
export const AlertDialogTrigger = forwardRef<never, AlertDialogTriggerProps>((props, _ref) => {
  const { transition = true, ...triggerProps } = props;

  return <HeadlessDialogTrigger {...triggerProps} transition={transition} />;
}) as AlertDialogComponent<AlertDialogTriggerProps>;
AlertDialogTrigger.displayName = "AlertDialogTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogPositionerProps extends HeadlessDialogPositionerProps {}

/** @platform Lynx — maps to `DialogView`; refs are unsupported. */
export const AlertDialogPositioner = forwardRef<never, AlertDialogPositionerProps>(
  (props, _ref) => {
    const { className, transition = true, ...positionerProps } = props;
    const classNames = useClassNames();

    return (
      <HeadlessDialogPositioner
        {...positionerProps}
        className={clsx(classNames.positioner, className)}
        transition={transition}
      />
    );
  },
) as AlertDialogComponent<AlertDialogPositionerProps>;
AlertDialogPositioner.displayName = "AlertDialogPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogBackdropProps extends HeadlessDialogBackdropProps {
  /**
   * Whether tapping the backdrop closes the alert dialog.
   * @defaultValue false
   */
  clickToClose?: HeadlessDialogBackdropProps["clickToClose"];
}

/**
 * @platform Lynx — refs are unsupported. Presence handlers and `bindtap` in
 * `dialogBackdropProps` are reserved for the dialog. `onClick` is called only when a tap
 * closes the dialog, so it does not fire while `clickToClose` is `false`.
 */
export const AlertDialogBackdrop = forwardRef<never, AlertDialogBackdropProps>((props, _ref) => {
  const { className, transition = true, clickToClose = false, ...backdropProps } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogBackdrop
      {...backdropProps}
      className={clsx(classNames.backdrop, className)}
      transition={transition}
      clickToClose={clickToClose}
    />
  );
}) as AlertDialogComponent<AlertDialogBackdropProps>;
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

////////////////////////////////////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogContentProps
  extends HeadlessDialogContentProps,
    LynxAccessibilityProps {
  /**
   * @defaultValue true
   */
  "accessibility-element"?: LynxAccessibilityProps["accessibility-element"];
  /**
   * @defaultValue "alertdialog"
   */
  "accessibility-role-description"?: LynxAccessibilityProps["accessibility-role-description"];
}

/**
 * @platform Lynx — refs are unsupported. Accessibility props are applied to the content view
 * through `dialogContentProps`, which takes precedence. Presence handlers in
 * `dialogContentProps` are reserved for the dialog; other native props and callbacks are forwarded.
 */
export const AlertDialogContent = forwardRef<never, AlertDialogContentProps>((props, _ref) => {
  const {
    children,
    className,
    style,
    delayed,
    transition = true,
    dialogContentProps,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "alertdialog",
    ...accessibilityProps
  } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogContent
      className={clsx(classNames.content, className)}
      style={style}
      delayed={delayed}
      transition={transition}
      dialogContentProps={{
        ...accessibilityProps,
        "accessibility-element": accessibilityElement,
        "accessibility-role-description": accessibilityRoleDescription,
        ...dialogContentProps,
      }}
    >
      {children}
    </HeadlessDialogContent>
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
    LynxAccessibilityProps {
  /**
   * @defaultValue true
   */
  "accessibility-heading"?: LynxAccessibilityProps["accessibility-heading"];
}

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

export interface AlertDialogActionProps extends HeadlessDialogCloseButtonProps {}

/** @platform Lynx — maps to `DialogClose`; `asChild` and refs are unsupported. */
export const AlertDialogAction = forwardRef<never, AlertDialogActionProps>((props, _ref) => {
  const { className, transition = true, ...closeProps } = props;
  const classNames = useClassNames();

  return (
    <HeadlessDialogCloseButton
      {...closeProps}
      className={clsx(classNames.action, className)}
      transition={transition}
    />
  );
}) as AlertDialogComponent<AlertDialogActionProps>;
AlertDialogAction.displayName = "AlertDialogAction";
