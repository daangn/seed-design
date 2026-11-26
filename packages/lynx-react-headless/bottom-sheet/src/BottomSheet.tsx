import * as React from "@lynx-js/react";
import { runOnMainThread } from "@lynx-js/react";
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
  useSheetContext,
} from "./engine";
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
} from "./engine";

type ViewProps = IntrinsicElements["view"];

const SKIP_ANIMATION_TRANSITION: SheetTransition = { type: "tween", duration: 0 };

export type BottomSheetRootRef = SheetRootRef;

export interface BottomSheetRootProps extends Omit<
  SheetRootProps,
  "show" | "defaultShow" | "onShowChange"
> {
  /**
   * Whether the sheet is open (controlled mode).
   * Internally mapped to `show` of the internal sheet engine.
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
   * Called when the sheet finishes opening (`true`) or closing (`false`), whatever changed the open
   * state. `false` comes after the layer is removed from the screen, so UI shown from it (such as a
   * snackbar) is not covered by or attached to the closing layer.
   */
  onAnimationEnd?: (open: boolean) => void;
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
 * 내부 `SheetRoot` 엔진에 open 상태 이름, 열림 변경 reason, `skipAnimation`을 연결합니다.
 * ref는 `open`·`close`·`snapTo`·`expand`·`collapse`를 제공하며, ref로 바꾼 열림 상태는 `onOpenChange`로
 * 알리지 않습니다.
 */
export const BottomSheetRoot = React.forwardRef<SheetRootRef, BottomSheetRootProps>(
  (props, forwardedRef) => {
    const {
      open,
      defaultOpen,
      onOpenChange,
      onAnimationEnd,
      onOpen,
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
    const handleOpen = useMemoizedFn(() => {
      "background only";
      onOpen?.();
      onAnimationEnd?.(true);
    });
    const handleClosed = useMemoizedFn(() => {
      "background only";
      onAnimationEnd?.(false);
    });
    const context = React.useMemo<Omit<UseBottomSheetContext, "layerSize">>(
      () => ({ rootRef, skipAnimation, setOpen }),
      [rootRef, skipAnimation, setOpen],
    );

    return (
      <SheetRoot
        {...sheetProps}
        ref={engineRef}
        show={open}
        defaultShow={defaultOpen}
        onShowChange={handleShowChange}
        onOpen={handleOpen}
      >
        <BottomSheetContextProvider value={context} onClosed={handleClosed}>
          {children}
        </BottomSheetContextProvider>
      </SheetRoot>
    );
  },
);
BottomSheetRoot.displayName = "BottomSheetRoot";

/**
 * 엔진이 측정한 레이어 크기를 Root context에 더하고, 닫혀 레이어가 unmount되면 `onClosed`를 부른다.
 */
function BottomSheetContextProvider(props: {
  value: Omit<UseBottomSheetContext, "layerSize">;
  onClosed: () => void;
  children?: React.ReactNode;
}): React.ReactElement {
  const { value, onClosed, children } = props;
  const { layerSize, mounted } = useSheetContext();
  // 엔진의 `onClose`는 레이어를 unmount하기 전에 오므로 그 시점에 띄운 native UI는 닫히는 overlay에 붙는다.
  // unmount가 commit된 뒤에도 effect는 main thread가 patch를 반영하기 전에 실행될 수 있어, main thread를
  // 한 번 왕복해 레이어 제거가 반영된 뒤 알린다.
  const prevMountedRef = React.useRef(mounted);
  // mount 상태가 바뀔 때마다 늘린다. 왕복하는 동안 다시 열렸으면(다시 닫혔더라도) 이전 닫힘은 알리지 않는다.
  const generationRef = React.useRef(0);
  React.useEffect(() => {
    if (prevMountedRef.current === mounted) return;
    prevMountedRef.current = mounted;
    const generation = ++generationRef.current;
    if (mounted) return;
    void runOnMainThread(() => {
      "main thread";
    })().then(() => {
      if (generationRef.current === generation) onClosed();
    });
  }, [mounted, onClosed]);
  const context = React.useMemo<UseBottomSheetContext>(
    () => ({ ...value, layerSize }),
    [value, layerSize],
  );

  return <BottomSheetProvider value={context}>{children}</BottomSheetProvider>;
}

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
