import * as React from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import {
  SheetBackdrop,
  SheetContent,
  SheetRoot,
  SheetView,
  type SheetBackdropProps,
  type SheetContentProps,
  type SheetRootProps,
  type SheetRootRef,
  type SheetTransition,
  type SheetViewProps,
} from "@lynx-js/lynx-ui-sheet";
import type { IntrinsicElements } from "@lynx-js/types";
import { useBottomSheetCloseButton } from "./useBottomSheetCloseButton.js";
import {
  BottomSheetProvider,
  useBottomSheetContext,
  type BottomSheetOpenChangeDetails,
  type BottomSheetOpenChangeReason,
  type UseBottomSheetContext,
} from "./useBottomSheetContext.js";
import { useBottomSheetTrigger } from "./useBottomSheetTrigger.js";

// The engine already owns mount gating and drag handling. Handle is its component, unchanged.
export {
  SheetHandle as BottomSheetHandle,
  type SheetHandleProps as BottomSheetHandleProps,
} from "@lynx-js/lynx-ui-sheet";

type ViewProps = IntrinsicElements["view"];

const SKIP_ANIMATION_TRANSITION: SheetTransition = { type: "tween", duration: 0 };

export type BottomSheetRootRef = SheetRootRef;

export interface BottomSheetRootProps
  extends Omit<SheetRootProps, "show" | "defaultShow" | "onShowChange"> {
  /**
   * Whether the sheet is open (controlled mode).
   * Internally mapped to `show` of `@lynx-js/lynx-ui-sheet`.
   */
  open?: boolean;
  /**
   * Whether the sheet is open by default (uncontrolled mode).
   * Internally mapped to `defaultShow`.
   * @defaultValue false
   */
  defaultOpen?: boolean;
  /**
   * Called once when Trigger, CloseButton, Backdrop or a drag changes the open state, with the
   * `reason` of the change. Changes made through the Root ref or the `open` prop are not reported.
   */
  onOpenChange?: (open: boolean, details: BottomSheetOpenChangeDetails) => void;
  /**
   * Opens from Trigger without animation and ends enter, exit and snap transitions
   * immediately unless Content receives its own transition.
   * @defaultValue false
   */
  skipAnimation?: boolean;
}

/**
 * @platform Lynx
 *
 * `@lynx-js/lynx-ui-sheet`의 `SheetRoot`에 open 상태 이름, 열림 변경 reason, `skipAnimation`을 연결합니다.
 * ref는 `open`·`close`·`snapTo`·`expand`·`collapse`를 제공하며, ref로 바꾼 열림 상태는 `onOpenChange`로
 * 알리지 않습니다.
 */
export const BottomSheetRoot = React.forwardRef<SheetRootRef, BottomSheetRootProps>(
  (props, forwardedRef) => {
    const {
      open,
      defaultOpen,
      onOpenChange,
      skipAnimation = false,
      children,
      ...sheetProps
    } = props;
    const engineRef = React.useRef<SheetRootRef | null>(null);
    // 엔진은 ref 호출과 사용자 동작을 모두 같은 `onShowChange`로 알린다. Trigger·CloseButton·Backdrop은
    // 엔진을 호출하는 동안만 reason을 남기고, ref 호출은 요청한 열림 값을 남겨 그 변경을 알리지 않는다.
    // 둘 다 없으면 엔진 스스로 바꾼 상태라 drag다.
    const pendingReasonRef = React.useRef<BottomSheetOpenChangeReason | null>(null);
    const imperativeOpenRef = React.useRef<boolean | null>(null);
    const [handle] = React.useState<SheetRootRef>(() => {
      const request = (nextOpen: boolean, action: (engine: SheetRootRef) => void) => {
        "background only";
        imperativeOpenRef.current = nextOpen;
        if (engineRef.current) action(engineRef.current);
      };
      return {
        open: (options) => request(true, (engine) => engine.open(options)),
        close: (options) => request(false, (engine) => engine.close(options)),
        snapTo: (index, options) => request(true, (engine) => engine.snapTo(index, options)),
        expand: (options) => request(true, (engine) => engine.expand(options)),
        collapse: (options) => request(true, (engine) => engine.collapse(options)),
      };
    });
    const rootRef = React.useRef(handle);
    React.useImperativeHandle(forwardedRef, () => handle, [handle]);

    const handleShowChange = useMemoizedFn((nextOpen: boolean) => {
      "background only";
      const reason = pendingReasonRef.current;
      if (reason === null && imperativeOpenRef.current === nextOpen) return;
      imperativeOpenRef.current = null;
      onOpenChange?.(nextOpen, { reason: reason ?? "drag" });
    });
    const setOpen = useMemoizedFn<UseBottomSheetContext["setOpen"]>((nextOpen, details) => {
      "background only";
      imperativeOpenRef.current = null;
      if (open !== undefined) {
        if (nextOpen !== open) onOpenChange?.(nextOpen, details);
        return;
      }
      const engine = engineRef.current;
      if (!engine) return;
      const options = skipAnimation ? { animate: false } : undefined;
      pendingReasonRef.current = details.reason;
      try {
        if (nextOpen) engine.open(options);
        else engine.close(options);
      } finally {
        pendingReasonRef.current = null;
      }
    });
    const context = React.useMemo<UseBottomSheetContext>(
      () => ({ rootRef, skipAnimation, setOpen }),
      [rootRef, skipAnimation, setOpen],
    );

    return (
      <BottomSheetProvider value={context}>
        <SheetRoot
          {...sheetProps}
          ref={engineRef}
          show={open}
          defaultShow={defaultOpen}
          onShowChange={handleShowChange}
        >
          {children}
        </SheetRoot>
      </BottomSheetProvider>
    );
  },
);
BottomSheetRoot.displayName = "BottomSheetRoot";

export interface BottomSheetTriggerProps extends ViewProps {}

/**
 * tap하면 시트를 여는 native `<view>`입니다. `onOpenChange`에 `"trigger"` reason을 전달합니다. Positioner 밖에 둡니다.
 */
export const BottomSheetTrigger = React.forwardRef<unknown, BottomSheetTriggerProps>(
  (props, ref) => {
    const { children, bindtap, ...nativeProps } = props;
    const { triggerProps } = useBottomSheetTrigger({ bindtap });

    return (
      <view {...triggerProps} {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
        {children}
      </view>
    );
  },
);
BottomSheetTrigger.displayName = "BottomSheetTrigger";

export interface BottomSheetCloseButtonProps extends ViewProps {}

/**
 * tap하면 시트를 닫는 native `<view>`입니다. `onOpenChange`에 `"closeButton"` reason을 전달합니다.
 */
export const BottomSheetCloseButton = React.forwardRef<unknown, BottomSheetCloseButtonProps>(
  (props, ref) => {
    const { children, bindtap, ...nativeProps } = props;
    const { closeButtonProps } = useBottomSheetCloseButton({ bindtap });

    return (
      <view
        {...closeButtonProps}
        {...nativeProps}
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      >
        {children}
      </view>
    );
  },
);
BottomSheetCloseButton.displayName = "BottomSheetCloseButton";

export interface BottomSheetPositionerProps extends SheetViewProps {}

/**
 * lynx-ui `SheetView`입니다. `container`를 지정하면 `SheetView`가 레이어를 `position: relative`로
 * 바꾸므로, overlay 레이어를 채우도록 너비와 높이를 `100%`로 맞춥니다.
 */
export function BottomSheetPositioner(props: BottomSheetPositionerProps): React.ReactElement {
  const { container, style, ...viewProps } = props;
  const positionerStyle = container ? { width: "100%", height: "100%", ...style } : style;

  return <SheetView {...viewProps} container={container} style={positionerStyle} />;
}
BottomSheetPositioner.displayName = "BottomSheetPositioner";

export interface BottomSheetBackdropProps extends SheetBackdropProps {}

/**
 * lynx-ui `SheetBackdrop`입니다. `clickToClose`(기본 `true`)이면 tap으로 시트를 닫고 `onOpenChange`에
 * `"interactOutside"` reason을 전달합니다. `onClick`은 닫기 여부와 관계없이 그 뒤에 호출합니다.
 */
export function BottomSheetBackdrop(props: BottomSheetBackdropProps): React.ReactElement {
  const { clickToClose = true, onClick, ...backdropProps } = props;
  const { setOpen } = useBottomSheetContext();
  const handleClick = useMemoizedFn(() => {
    "background only";
    if (clickToClose) setOpen(false, { reason: "interactOutside" });
    onClick?.();
  });

  return <SheetBackdrop {...backdropProps} clickToClose={false} onClick={handleClick} />;
}
BottomSheetBackdrop.displayName = "BottomSheetBackdrop";

export interface BottomSheetContentProps extends SheetContentProps {}

/**
 * `SheetContent`입니다. Root의 `skipAnimation`이면 직접 지정하지 않은 전환을 즉시 끝냅니다.
 */
export function BottomSheetContent(props: BottomSheetContentProps): React.ReactElement {
  const { snapAnimation, enterAnimation, exitAnimation, ...contentProps } = props;
  const { skipAnimation } = useBottomSheetContext();
  const fallback = skipAnimation ? SKIP_ANIMATION_TRANSITION : undefined;

  return (
    <SheetContent
      {...contentProps}
      snapAnimation={snapAnimation ?? fallback}
      enterAnimation={enterAnimation ?? fallback}
      exitAnimation={exitAnimation ?? fallback}
    />
  );
}
BottomSheetContent.displayName = "BottomSheetContent";
