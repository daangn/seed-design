import {
  bottomSheet,
  type BottomSheetVariantProps,
} from "@seed-design/lynx-css/recipes/bottom-sheet";
import { bottomSheetHandle } from "@seed-design/lynx-css/recipes/bottom-sheet-handle";
import {
  SheetBackdrop,
  SheetContent,
  SheetHandle,
  SheetRoot,
  type SheetBackdropProps,
  type SheetContentProps,
  type SheetHandleProps,
  type SheetRootProps,
  type SheetRootRef,
} from "@lynx-js/lynx-ui-sheet";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type FC,
  type ReactNode,
  type Ref,
  type RefObject,
} from "@lynx-js/react";
import type { CSSProperties } from "react";
import clsx from "clsx";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

const { ClassNamesProvider, withContext } = createSlotRecipeContext(bottomSheet);

const DEFAULT_SNAP_POINTS: Array<number | string> = ["fit"];

/**
 * Trigger가 Root의 imperative API(`open` 등)를 호출할 수 있도록 `SheetRootRef`를 공유하는 내부 컨텍스트.
 */
const RootRefContext = createContext<RefObject<SheetRootRef | null> | null>(null);

function useRootRef(): RefObject<SheetRootRef | null> {
  const ctx = useContext(RootRefContext);
  if (!ctx) {
    throw new Error("BottomSheet compound components must be used within BottomSheetRoot");
  }
  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetRootProps
  extends BottomSheetVariantProps,
    Omit<SheetRootProps, "show" | "defaultShow" | "onShowChange"> {
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
}

/**
 * @platform Lynx — wraps `@lynx-js/lynx-ui-sheet`
 *
 * 웹 대비 미지원 기능:
 * - `lazyMount`, `unmountOnExit`: lynx-ui-sheet의 `forceMount`로 대체
 * - `BottomSheetPositioner`: lynx-ui-sheet의 `SheetView`가 자동 처리하므로 별도 슬롯 없음
 * - `BottomSheetCloseButton`: Tier B (Lynx SVG 지원 후 추가 예정)
 * - `BottomSheetTrigger`의 `asChild`: 미지원 (기본 `<view>`만)
 */
export const BottomSheetRoot = forwardRef<SheetRootRef, BottomSheetRootProps>(
  (props, forwardedRef) => {
    const [variantProps, restProps] = bottomSheet.splitVariantProps(props);
    const { open, defaultOpen, onOpenChange, snapPoints, children, ...nativeProps } = restProps;
    const { headerAlign, skipAnimation } = variantProps;

    const internalRef = useRef<SheetRootRef | null>(null);

    // `SheetRoot`에 직접 ref를 넘겨 Trigger 컨텍스트와 외부 ref에 같은 인스턴스를 동기화한다.
    // `useImperativeHandle([])`은 마운트 시점 값(null)을 고정시키는 함정이 있어 사용하지 않는다.
    const mergedRef = useCallback(
      (value: SheetRootRef | null) => {
        internalRef.current = value;
        if (typeof forwardedRef === "function") {
          forwardedRef(value);
        } else if (forwardedRef) {
          forwardedRef.current = value;
        }
      },
      [forwardedRef],
    );

    const classNames = useMemo(
      () => bottomSheet(variantProps),
      // variantProps 객체는 매 렌더 새로 생성되므로 개별 variant 값으로 의존성을 고정한다.
      [headerAlign, skipAnimation],
    );

    return (
      <RootRefContext.Provider value={internalRef}>
        <ClassNamesProvider value={classNames}>
          <SheetRoot
            ref={mergedRef}
            show={open}
            defaultShow={defaultOpen}
            onShowChange={onOpenChange}
            snapPoints={snapPoints ?? DEFAULT_SNAP_POINTS}
            {...nativeProps}
          >
            {children}
          </SheetRoot>
        </ClassNamesProvider>
      </RootRefContext.Provider>
    );
  },
);
BottomSheetRoot.displayName = "BottomSheetRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTriggerProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  bindtap?: () => void;
}

export const BottomSheetTrigger = forwardRef<unknown, BottomSheetTriggerProps>((props, ref) => {
  const { children, className, style, bindtap: userBindtap } = props;
  const rootRef = useRootRef();

  // `bindtap`을 직접 prop으로 쓰면 React DOM `<view>` 타입(SVG)이 적용되어 TS가 거부한다.
  // Lynx JSX 런타임은 이 prop을 올바르게 처리하므로 spread로 우회한다 (ActionButton과 동일 패턴).
  const handlers = {
    bindtap: () => {
      rootRef.current?.open();
      userBindtap?.();
    },
  };

  return (
    <view
      {...(ref ? { ref: ref as Ref<SVGViewElement> } : {})}
      {...handlers}
      className={className}
      style={style}
    >
      {children}
    </view>
  );
});
BottomSheetTrigger.displayName = "BottomSheetTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop / Content — lynx-ui-sheet 컴포넌트를 감싸서 recipe 슬롯 className 적용
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBackdropProps extends SheetBackdropProps {}

export const BottomSheetBackdrop = withContext<unknown, BottomSheetBackdropProps>(
  SheetBackdrop,
  "backdrop",
);
BottomSheetBackdrop.displayName = "BottomSheetBackdrop";

export interface BottomSheetContentProps extends SheetContentProps {}

export const BottomSheetContent = withContext<unknown, BottomSheetContentProps>(
  SheetContent,
  "content",
);
BottomSheetContent.displayName = "BottomSheetContent";

////////////////////////////////////////////////////////////////////////////////////
// Handle — 자체 bottomSheetHandle recipe 사용 (Root context 비의존)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetHandleProps extends SheetHandleProps {}

// lynx-ui-sheet v3.130.1 기준 `SheetHandle`의 타입에는 `children`이 없지만 구현이
// `<view {...rest}>`로 통과시키므로 touchArea 내부 뷰를 children으로 삽입할 수 있다.
const SheetHandleWithChildren = SheetHandle as FC<SheetHandleProps & { children?: ReactNode }>;

/**
 * @remarks
 * `ref`는 lynx-ui-sheet의 `SheetHandle`이 forwardRef를 사용하지 않아 현재 런타임에서 무시된다.
 * API 일관성을 위해 시그니처는 유지한다.
 */
export const BottomSheetHandle = forwardRef<unknown, BottomSheetHandleProps>((props, _ref) => {
  const { className, style, ...rest } = props;
  const classNames = bottomSheetHandle();

  return (
    <SheetHandleWithChildren className={clsx(classNames.root, className)} style={style} {...rest}>
      <view className={classNames.touchArea} />
    </SheetHandleWithChildren>
  );
});
BottomSheetHandle.displayName = "BottomSheetHandle";

////////////////////////////////////////////////////////////////////////////////////
// Header / Body / Footer / Title / Description — 네이티브 view/text + 슬롯 className
////////////////////////////////////////////////////////////////////////////////////

interface SlotProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface BottomSheetHeaderProps extends SlotProps {}
export const BottomSheetHeader = withContext<unknown, BottomSheetHeaderProps>("view", "header");
BottomSheetHeader.displayName = "BottomSheetHeader";

export interface BottomSheetBodyProps extends SlotProps {}
export const BottomSheetBody = withContext<unknown, BottomSheetBodyProps>("view", "body");
BottomSheetBody.displayName = "BottomSheetBody";

export interface BottomSheetFooterProps extends SlotProps {}
export const BottomSheetFooter = withContext<unknown, BottomSheetFooterProps>("view", "footer");
BottomSheetFooter.displayName = "BottomSheetFooter";

export interface BottomSheetTitleProps extends SlotProps {}
export const BottomSheetTitle = withContext<unknown, BottomSheetTitleProps>("text", "title");
BottomSheetTitle.displayName = "BottomSheetTitle";

export interface BottomSheetDescriptionProps extends SlotProps {}
export const BottomSheetDescription = withContext<unknown, BottomSheetDescriptionProps>(
  "text",
  "description",
);
BottomSheetDescription.displayName = "BottomSheetDescription";
