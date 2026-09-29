import * as React from "@lynx-js/react";
import {
  SheetContent,
  SheetRoot,
  type SheetContentProps,
  type SheetRootProps,
  type SheetRootRef,
  type SheetTransition,
} from "@lynx-js/lynx-ui-sheet";
import type { IntrinsicElements } from "@lynx-js/types";
import { BottomSheetProvider, useBottomSheetContext } from "./useBottomSheetContext.js";
import { useBottomSheetTrigger } from "./useBottomSheetTrigger.js";

// The engine already owns mount gating, backdrop dismissal and drag handling.
// These parts are its components, unchanged.
export {
  SheetBackdrop as BottomSheetBackdrop,
  SheetHandle as BottomSheetHandle,
  SheetView as BottomSheetPositioner,
  type SheetBackdropProps as BottomSheetBackdropProps,
  type SheetHandleProps as BottomSheetHandleProps,
  type SheetViewProps as BottomSheetPositionerProps,
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
   * Called when the sheet's open state is about to change.
   * Internally mapped to `onShowChange`.
   */
  onOpenChange?: (open: boolean) => void;
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
 * `@lynx-js/lynx-ui-sheet`의 `SheetRoot`에 open 상태 이름과 `skipAnimation`을 연결합니다.
 * ref는 `SheetRoot`의 `open`·`close`·`snapTo`·`expand`·`collapse`를 그대로 노출합니다.
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
    const rootRef = React.useRef<SheetRootRef | null>(null);
    const ref = React.useMemo<React.Ref<SheetRootRef>>(() => {
      if (!forwardedRef) return rootRef;
      return (value: SheetRootRef | null) => {
        "background only";
        rootRef.current = value;
        if (typeof forwardedRef === "function") forwardedRef(value);
        else forwardedRef.current = value;
      };
    }, [forwardedRef]);
    const context = React.useMemo(() => ({ rootRef, skipAnimation }), [skipAnimation]);

    return (
      <BottomSheetProvider value={context}>
        <SheetRoot
          {...sheetProps}
          ref={ref}
          show={open}
          defaultShow={defaultOpen}
          onShowChange={onOpenChange}
        >
          {children}
        </SheetRoot>
      </BottomSheetProvider>
    );
  },
);
BottomSheetRoot.displayName = "BottomSheetRoot";

export interface BottomSheetTriggerProps extends Omit<ViewProps, "main-thread:bindtap"> {}

/**
 * tap하면 Root ref로 시트를 여는 native `<view>`입니다. Positioner 밖에 둡니다.
 */
export const BottomSheetTrigger = React.forwardRef<unknown, BottomSheetTriggerProps>(
  (props, ref) => {
    const { children, bindtap, ...nativeProps } = props;
    const { triggerProps } = useBottomSheetTrigger({ bindtap });

    return (
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps} {...triggerProps}>
        {children}
      </view>
    );
  },
);
BottomSheetTrigger.displayName = "BottomSheetTrigger";

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
