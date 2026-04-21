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
  SheetView,
  type SheetBackdropProps,
  type SheetContentProps,
  type SheetHandleProps,
  type SheetRootProps,
  type SheetRootRef,
  type SheetTransition,
  type SheetViewProps,
} from "@lynx-js/lynx-ui-sheet";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type Ref,
  type RefObject,
} from "@lynx-js/react";
import type { CSSProperties } from "react";
import clsx from "clsx";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

const { ClassNamesProvider, withContext, withViewContext, withTextContext } =
  createSlotRecipeContext(bottomSheet);

const DEFAULT_SNAP_POINTS: Array<number | string> = ["fit"];

////////////////////////////////////////////////////////////////////////////////////
// SEED Transitions — 웹 SEED BottomSheet (recipe: d6/d4 + enter-expressive/enter/exit)
// 의 감각을 lynx-ui-sheet의 spring으로 근사한 기본값.
//
// spring을 사용하는 이유:
// - lynx-ui-sheet 내장 main-thread 구현이라 stiffness/damping/mass만 JSON 직렬화로
//   안전 전달 (ease 함수 크로스스레드 문제 없음)
// - lynx-ui 공식 예제도 spring 기본 — 런타임 안정성 검증됨
//
// 튜닝 기준 (300ms 수준의 빠르고 약간의 탄성감):
// - 웹 d6 + enter-expressive ≈ stiffness 400, damping 35 (snap 드래그 settle)
// - 웹 d6 + enter              ≈ stiffness 350, damping 32 (첫 open)
// - 웹 d4 + exit               ≈ stiffness 400, damping 40 (close, critically damped)
////////////////////////////////////////////////////////////////////////////////////

const SEED_SNAP_ANIMATION: SheetTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
};

const SEED_ENTER_ANIMATION: SheetTransition = {
  type: "spring",
  stiffness: 350,
  damping: 32,
};

const SEED_EXIT_ANIMATION: SheetTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
};

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

export type BottomSheetRootRef = SheetRootRef;

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
// Positioner — SheetView를 래핑해 mount gating 담당 (웹 BottomSheetPositioner에 대응)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetPositionerProps extends SheetViewProps {}

/**
 * Backdrop/Content는 반드시 `BottomSheetPositioner` 안에 배치해야 한다.
 *
 * `SheetView`는 `mounted || forceMount` 조건으로 자식을 gating하므로 시트가 처음
 * 열리기 전까지는 SheetBackdrop/SheetContent가 마운트되지 않아 motion value
 * 초기화 레이스를 피할 수 있다. Trigger는 이 컴포넌트 밖에 두어야 탭 가능하다.
 *
 * recipe의 `positioner` slot className을 자동 적용해 `position: fixed` + 전체
 * 뷰포트 커버 레이아웃을 보장한다.
 */
export const BottomSheetPositioner = withContext<unknown, BottomSheetPositionerProps>(
  SheetView,
  "positioner",
);
BottomSheetPositioner.displayName = "BottomSheetPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop / Content — lynx-ui-sheet 컴포넌트를 감싸서 recipe 슬롯 className 적용
//
// lynx-ui-sheet의 컴포넌트는 React 함수 컴포넌트이므로 `withContext`로 래핑해도
// `React.createElement(Component, ...)`가 정상 동작한다.
// (반면 네이티브 `<view>`/`<text>` intrinsic은 리터럴 JSX가 아니면 Lynx 컴파일러의
// BackgroundSnapshot 정적 분석을 우회해 런타임 에러가 발생한다 — 하단 slot 참고.)
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
  {
    defaultProps: {
      snapAnimation: SEED_SNAP_ANIMATION,
      enterAnimation: SEED_ENTER_ANIMATION,
      exitAnimation: SEED_EXIT_ANIMATION,
    },
  },
);
BottomSheetContent.displayName = "BottomSheetContent";

////////////////////////////////////////////////////////////////////////////////////
// Handle — 자체 bottomSheetHandle recipe 사용 (Root context 비의존)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetHandleProps extends SheetHandleProps {}

/**
 * @remarks
 * `SheetHandle`은 forwardRef가 아니므로 ref 시그니처는 제공하지 않는다. touchArea 슬롯은
 * `SheetHandle` JSX가 정적으로 children을 받지 않는 구조라 적용하지 않는다 (Lynx
 * BackgroundSnapshot이 정적 slot 외의 동적 children 삽입을 허용하지 않음).
 */
export function BottomSheetHandle(props: BottomSheetHandleProps) {
  const { className, style, ...rest } = props;
  const classNames = bottomSheetHandle();

  return <SheetHandle className={clsx(classNames.root, className)} style={style} {...rest} />;
}
BottomSheetHandle.displayName = "BottomSheetHandle";

////////////////////////////////////////////////////////////////////////////////////
// Header / Body / Footer / Title / Description — 네이티브 view/text + 슬롯 className
//
// `createSlotRecipeContext` 가 제공하는 `withViewContext` / `withTextContext` 헬퍼는
// forwardRef 본문에 **리터럴 `<view>` / `<text>` JSX** 를 작성하므로 Lynx 컴파일러의
// 정적 분석을 통과한다. intrinsic string (`"view"`) 을 `withContext` 에 넘기는
// 패턴은 `React.createElement("view", ...)` 로 컴파일되어
// `BackgroundSnapshot not found: view` 런타임 에러를 일으키므로 금지
// (자세한 내용은 AGENTS.md 의 "Native tag literal JSX constraint" 섹션 참조).
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetSlotProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface BottomSheetHeaderProps extends BottomSheetSlotProps {}
export const BottomSheetHeader = withViewContext("header");
BottomSheetHeader.displayName = "BottomSheetHeader";

export interface BottomSheetBodyProps extends BottomSheetSlotProps {}
export const BottomSheetBody = withViewContext("body");
BottomSheetBody.displayName = "BottomSheetBody";

export interface BottomSheetFooterProps extends BottomSheetSlotProps {}
export const BottomSheetFooter = withViewContext("footer");
BottomSheetFooter.displayName = "BottomSheetFooter";

export interface BottomSheetTitleProps extends BottomSheetSlotProps {}
export const BottomSheetTitle = withTextContext("title");
BottomSheetTitle.displayName = "BottomSheetTitle";

export interface BottomSheetDescriptionProps extends BottomSheetSlotProps {}
export const BottomSheetDescription = withTextContext("description");
BottomSheetDescription.displayName = "BottomSheetDescription";
