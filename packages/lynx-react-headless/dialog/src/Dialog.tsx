import * as React from "@lynx-js/react";
import {
  DialogBackdrop as LynxDialogBackdrop,
  DialogClose as LynxDialogClose,
  DialogContent as LynxDialogContent,
  DialogRoot as LynxDialogRoot,
  DialogTrigger as LynxDialogTrigger,
  DialogView as LynxDialogView,
  type DialogBackdropProps as LynxDialogBackdropProps,
  type DialogCloseProps as LynxDialogCloseProps,
  type DialogContentProps as LynxDialogContentProps,
  type DialogRootProps as LynxDialogRootProps,
  type DialogTriggerProps as LynxDialogTriggerProps,
  type DialogViewProps as LynxDialogViewProps,
} from "@lynx-js/lynx-ui-dialog";
import type { IntrinsicElements } from "@lynx-js/types";
import { DialogProvider, useDialogContext } from "./useDialogContext.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];

/** Content와 Backdrop이 presence 전환을 추적하려고 직접 바인딩하는 native 이벤트입니다. */
type PresenceHandlerKey =
  | "bindanimationstart"
  | "bindanimationend"
  | "bindanimationcancel"
  | "bindtransitionstart"
  | "bindtransitionend";

const PRESENCE_HANDLER_KEYS: readonly PresenceHandlerKey[] = [
  "bindanimationstart",
  "bindanimationend",
  "bindanimationcancel",
  "bindtransitionstart",
  "bindtransitionend",
];
const BACKDROP_HANDLER_KEYS: readonly (PresenceHandlerKey | "bindtap")[] = [
  ...PRESENCE_HANDLER_KEYS,
  "bindtap",
];

/**
 * lynx-ui-dialog는 `dialogContentProps`·`dialogBackdropProps`를 자체 handler 뒤에 펼친다.
 * 같은 key를 넘기면 presence·닫힘 handler가 대체되므로 예약 key만 제외하고 나머지는 그대로 전달한다.
 */
function omitReservedHandlers<P extends ViewProps>(
  props: P | undefined,
  reservedKeys: readonly (keyof ViewProps)[],
): P | undefined {
  if (!props || !reservedKeys.some((key) => key in props)) return props;
  const nativeProps = { ...props };
  for (const key of reservedKeys) delete nativeProps[key];
  return nativeProps;
}

function useResolvedTransition(transition: boolean | undefined): boolean | undefined {
  const { skipAnimation } = useDialogContext();
  return skipAnimation ? false : transition;
}

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps
  extends Omit<LynxDialogRootProps, "show" | "defaultShow" | "onShowChange"> {
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
   * Called once with the next open state when Trigger, CloseButton or Backdrop requests a change.
   * Internally mapped to `onShowChange`. The close reason is not provided.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Turns off `transition` on every part so that open and close finish without transition classes.
   * @defaultValue false
   */
  skipAnimation?: boolean;
}

/**
 * @platform Lynx
 *
 * `@lynx-js/lynx-ui-dialog`의 `DialogRoot`에 open 상태 이름과 `skipAnimation`을 연결합니다.
 * ref, focus 관리, Escape 닫힘, `asChild`, 닫힘 원인은 제공하지 않습니다.
 */
export function DialogRoot(props: DialogRootProps): React.ReactElement {
  const { open, defaultOpen, onOpenChange, skipAnimation = false, children, ...rootProps } = props;
  const context = React.useMemo(() => ({ skipAnimation }), [skipAnimation]);

  return (
    <DialogProvider value={context}>
      <LynxDialogRoot
        {...rootProps}
        show={open}
        defaultShow={defaultOpen}
        onShowChange={onOpenChange}
      >
        {children}
      </LynxDialogRoot>
    </DialogProvider>
  );
}
DialogRoot.displayName = "DialogRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger / CloseButton
////////////////////////////////////////////////////////////////////////////////////

export interface DialogTriggerProps extends LynxDialogTriggerProps {}

/**
 * tap하면 Dialog를 여는 lynx-ui `DialogTrigger`입니다. 자식을 감싸는 native view를 렌더링하며
 * 열림·닫힘 전환 중에는 tap을 받지 않습니다. Positioner 밖에 둡니다.
 */
export function DialogTrigger(props: DialogTriggerProps): React.ReactElement {
  const { transition, ...triggerProps } = props;

  return <LynxDialogTrigger {...triggerProps} transition={useResolvedTransition(transition)} />;
}
DialogTrigger.displayName = "DialogTrigger";

export interface DialogCloseButtonProps extends LynxDialogCloseProps {}

/**
 * tap하면 Dialog를 닫는 lynx-ui `DialogClose`입니다. 열림·닫힘 전환 중이거나 `disabled`이면
 * tap을 받지 않습니다.
 */
export function DialogCloseButton(props: DialogCloseButtonProps): React.ReactElement {
  const { transition, ...closeProps } = props;

  return <LynxDialogClose {...closeProps} transition={useResolvedTransition(transition)} />;
}
DialogCloseButton.displayName = "DialogCloseButton";

////////////////////////////////////////////////////////////////////////////////////
// Positioner / Backdrop / Content
////////////////////////////////////////////////////////////////////////////////////

export interface DialogPositionerProps
  extends Omit<LynxDialogViewProps, "container" | "overlayLevel" | "dialogViewProps"> {
  /**
   * Native container name such as `"window"`. When set, the layer renders into a native
   * `<overlay>` that can cover host UI outside the Lynx view. Otherwise it renders as a
   * `position: fixed` `<view>` inside the Lynx view.
   */
  container?: LynxDialogViewProps["container"];
  /**
   * Display level among native overlays. Only applies when `container` is set.
   */
  overlayLevel?: LynxDialogViewProps["overlayLevel"];
  /**
   * Native props spread onto the layer host, the same as `overlayViewProps` of lynx-ui `OverlayView`.
   * They go to the `<overlay>` when `container` is set, and to the layer `<view>` otherwise.
   */
  dialogViewProps?: LynxDialogViewProps["dialogViewProps"];
}

/**
 * 열려 있거나 `forceMount`일 때만 자식을 mount하는 lynx-ui `DialogView`입니다.
 * `container`를 지정하면 native overlay에, 아니면 `position: fixed` view에 렌더링합니다.
 * overlay 모드에서는 `style`이 `<overlay>` 안의 `position: relative` view에 붙어 inset으로 크기가
 * 정해지지 않으므로 `width`·`height`를 `100%`로 채웁니다. `style`로 덮어쓸 수 있습니다.
 */
export function DialogPositioner(props: DialogPositionerProps): React.ReactElement {
  const { transition, container, style, ...viewProps } = props;
  const positionerStyle = container ? { width: "100%", height: "100%", ...style } : style;

  return (
    <LynxDialogView
      {...viewProps}
      container={container}
      style={positionerStyle}
      transition={useResolvedTransition(transition)}
    />
  );
}
DialogPositioner.displayName = "DialogPositioner";

export interface DialogBackdropProps extends Omit<LynxDialogBackdropProps, "dialogBackdropProps"> {
  /**
   * Native view props spread onto the backdrop.
   * Presence handlers and `bindtap` are reserved for the dialog. `onClick` is called only when a
   * backdrop tap closes the dialog, so it does not fire while `clickToClose` is `false`.
   */
  dialogBackdropProps?: Omit<ViewProps, PresenceHandlerKey | "bindtap">;
}

/**
 * lynx-ui `DialogBackdrop`입니다. `clickToClose`(기본 `true`)이면 tap으로 Dialog를 닫습니다.
 */
export function DialogBackdrop(props: DialogBackdropProps): React.ReactElement {
  const { transition, dialogBackdropProps, ...backdropProps } = props;

  return (
    <LynxDialogBackdrop
      {...backdropProps}
      transition={useResolvedTransition(transition)}
      dialogBackdropProps={omitReservedHandlers(dialogBackdropProps, BACKDROP_HANDLER_KEYS)}
    />
  );
}
DialogBackdrop.displayName = "DialogBackdrop";

export interface DialogContentProps extends Omit<LynxDialogContentProps, "dialogContentProps"> {
  /**
   * Native view props spread onto the content view.
   * Presence handlers are reserved for the dialog.
   */
  dialogContentProps?: Omit<ViewProps, PresenceHandlerKey>;
}

/**
 * lynx-ui `DialogContent`입니다. 위치와 외형은 `className`·`style`로 지정합니다.
 */
export function DialogContent(props: DialogContentProps): React.ReactElement {
  const { transition, dialogContentProps, ...contentProps } = props;

  return (
    <LynxDialogContent
      {...contentProps}
      transition={useResolvedTransition(transition)}
      dialogContentProps={omitReservedHandlers(dialogContentProps, PRESENCE_HANDLER_KEYS)}
    />
  );
}
DialogContent.displayName = "DialogContent";

////////////////////////////////////////////////////////////////////////////////////
// Title / Description
////////////////////////////////////////////////////////////////////////////////////

export interface DialogTitleProps extends TextProps {
  /**
   * @defaultValue true
   */
  "accessibility-heading"?: TextProps["accessibility-heading"];
}

/**
 * 제목 native `<text>`입니다. 스크린 리더가 제목으로 읽도록 `accessibility-heading`을 기본으로 켭니다.
 * Lynx는 Content와 제목의 접근성 연결을 제공하지 않습니다.
 */
export const DialogTitle = React.forwardRef<unknown, DialogTitleProps>((props, ref) => {
  const { children, "accessibility-heading": accessibilityHeading = true, ...nativeProps } = props;

  return (
    <text
      {...{ "accessibility-heading": accessibilityHeading }}
      {...nativeProps}
      {...(ref ? { ref: ref as TextProps["ref"] } : {})}
    >
      {children}
    </text>
  );
});
DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps extends TextProps {}

/** 설명 native `<text>`입니다. Lynx는 Content와 설명의 접근성 연결을 제공하지 않습니다. */
export const DialogDescription = React.forwardRef<unknown, DialogDescriptionProps>((props, ref) => {
  const { children, ...nativeProps } = props;

  return (
    <text {...nativeProps} {...(ref ? { ref: ref as TextProps["ref"] } : {})}>
      {children}
    </text>
  );
});
DialogDescription.displayName = "DialogDescription";
