import {
  bottomSheet,
  type BottomSheetVariantProps,
} from "@seed-design/lynx-css/recipes/bottom-sheet";
import { bottomSheetHandle } from "@seed-design/lynx-css/recipes/bottom-sheet-handle";
import {
  BottomSheetBackdrop as HeadlessBottomSheetBackdrop,
  BottomSheetContent as HeadlessBottomSheetContent,
  BottomSheetHandle as HeadlessBottomSheetHandle,
  BottomSheetPositioner as HeadlessBottomSheetPositioner,
  BottomSheetRoot as HeadlessBottomSheetRoot,
  useBottomSheetContext,
  useBottomSheetTrigger,
  type BottomSheetBackdropProps as HeadlessBottomSheetBackdropProps,
  type BottomSheetContentProps as HeadlessBottomSheetContentProps,
  type BottomSheetHandleProps as HeadlessBottomSheetHandleProps,
  type BottomSheetPositionerProps as HeadlessBottomSheetPositionerProps,
  type BottomSheetRootProps as HeadlessBottomSheetRootProps,
  type BottomSheetRootRef as HeadlessBottomSheetRootRef,
} from "@seed-design/lynx-react-bottom-sheet";
import {
  forwardRef,
  useMemo,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactElement,
  type RefAttributes,
} from "@lynx-js/react";
import clsx from "clsx";

import { useSafeArea } from "../../hooks/useSafeArea";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";

type BottomSheetClassNames = ReturnType<typeof bottomSheet>;
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;
type SheetTransition = NonNullable<HeadlessBottomSheetContentProps["snapAnimation"]>;

const { ClassNamesProvider, useClassNames, withContext } = createSlotRecipeContext(bottomSheet);

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

export const SEED_SNAP_ANIMATION: SheetTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
};

export const SEED_ENTER_ANIMATION: SheetTransition = {
  type: "spring",
  stiffness: 350,
  damping: 32,
};

export const SEED_EXIT_ANIMATION: SheetTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
};

////////////////////////////////////////////////////////////////////////////////////
// Root
////////////////////////////////////////////////////////////////////////////////////

export type BottomSheetRootRef = HeadlessBottomSheetRootRef;

export interface BottomSheetRootProps
  extends BottomSheetVariantProps,
    Omit<HeadlessBottomSheetRootProps, keyof BottomSheetVariantProps> {}

/**
 * @platform Lynx — `@seed-design/lynx-react-bottom-sheet` 위에 SEED recipe를 조립한다.
 *
 * 웹 대비 미지원 기능:
 * - `lazyMount`, `unmountOnExit`: `BottomSheetPositioner`의 `forceMount`로 대체
 * - `BottomSheetCloseButton`: Tier B (Lynx SVG 지원 후 추가 예정)
 * - `BottomSheetTrigger`의 `asChild`: 미지원 (기본 `<view>`만)
 */
export const BottomSheetRoot: LynxForwardRefComponent<BottomSheetRootRef, BottomSheetRootProps> =
  forwardRef<BottomSheetRootRef, BottomSheetRootProps>((props, ref) => {
    const [variantProps, restProps] = bottomSheet.splitVariantProps(props);
    const { children, ...rootProps } = restProps;
    const { headerAlign, skipAnimation } = variantProps;

    const classNames = useMemo(
      () => bottomSheet(variantProps),
      // variantProps 객체는 매 렌더 새로 생성되므로 개별 variant 값으로 의존성을 고정한다.
      [headerAlign, skipAnimation],
    );

    return (
      <ClassNamesProvider value={classNames}>
        <HeadlessBottomSheetRoot
          {...(ref ? { ref } : {})}
          {...rootProps}
          skipAnimation={skipAnimation === true}
        >
          {children}
        </HeadlessBottomSheetRoot>
      </ClassNamesProvider>
    );
  });
BottomSheetRoot.displayName = "BottomSheetRoot";

////////////////////////////////////////////////////////////////////////////////////
// Trigger
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTriggerProps extends LynxHostProps<"view"> {}

export const BottomSheetTrigger: LynxForwardRefComponent<unknown, BottomSheetTriggerProps> =
  forwardRef<unknown, BottomSheetTriggerProps>((props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    const { triggerProps } = useBottomSheetTrigger();

    return (
      <view
        {...mergeProps(
          triggerProps,
          { style: style as never },
          nativeProps,
          ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {},
        )}
        className={className}
      >
        {children}
      </view>
    );
  });
BottomSheetTrigger.displayName = "BottomSheetTrigger";

////////////////////////////////////////////////////////////////////////////////////
// Positioner — mount gating은 lynx-ui-sheet의 SheetView가 담당 (웹 BottomSheetPositioner에 대응)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetPositionerProps extends HeadlessBottomSheetPositionerProps {}

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
export const BottomSheetPositioner: LynxForwardRefComponent<unknown, BottomSheetPositionerProps> =
  withContext<unknown, BottomSheetPositionerProps>(HeadlessBottomSheetPositioner, "positioner");
BottomSheetPositioner.displayName = "BottomSheetPositioner";

////////////////////////////////////////////////////////////////////////////////////
// Backdrop / Content — lynx-ui-sheet 컴포넌트를 감싸서 recipe 슬롯 className 적용
//
// lynx-ui-sheet의 컴포넌트는 React 함수 컴포넌트이므로 `withContext`로 래핑해도
// `React.createElement(Component, ...)`가 정상 동작한다.
// (반면 네이티브 `<view>`/`<text>` intrinsic은 리터럴 JSX가 아니면 Lynx 컴파일러의
// BackgroundSnapshot 정적 분석을 우회해 런타임 에러가 발생한다 — 하단 slot 참고.)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBackdropProps extends HeadlessBottomSheetBackdropProps {}

export const BottomSheetBackdrop: LynxForwardRefComponent<unknown, BottomSheetBackdropProps> =
  withContext<unknown, BottomSheetBackdropProps>(HeadlessBottomSheetBackdrop, "backdrop");
BottomSheetBackdrop.displayName = "BottomSheetBackdrop";

export interface BottomSheetContentProps extends HeadlessBottomSheetContentProps {}

export const BottomSheetContent: LynxForwardRefComponent<unknown, BottomSheetContentProps> =
  forwardRef<unknown, BottomSheetContentProps>((props, ref) => {
    const {
      className,
      style,
      innerStyle,
      snapAnimation,
      enterAnimation,
      exitAnimation,
      ...restProps
    } = props;
    const classNames = useClassNames();
    const { skipAnimation } = useBottomSheetContext();
    const { safeAreaInsetBottom } = useSafeArea();

    return (
      <HeadlessBottomSheetContent
        {...mergeProps(ref ? { ref } : {}, restProps)}
        className={clsx(classNames.content, className)}
        // `SheetContent` pins its outer view with an inline `left: 0`, which a recipe class
        // cannot outrank. Releasing it lets the positioner's `justify-content: center` place
        // the sheet, so the recipe's `max-width` leaves centered gutters instead of a right
        // one. `transform` is off-limits here — the main-thread motion engine owns it.
        style={{ left: "auto", ...style }}
        innerStyle={{
          display: "flex",
          flexDirection: "column",
          minHeight: "0",
          paddingBottom: safeAreaInsetBottom,
          ...innerStyle,
        }}
        // With `skipAnimation`, leave SEED springs out so headless Content ends transitions immediately.
        snapAnimation={snapAnimation ?? (skipAnimation ? undefined : SEED_SNAP_ANIMATION)}
        enterAnimation={enterAnimation ?? (skipAnimation ? undefined : SEED_ENTER_ANIMATION)}
        exitAnimation={exitAnimation ?? (skipAnimation ? undefined : SEED_EXIT_ANIMATION)}
      />
    );
  });
BottomSheetContent.displayName = "BottomSheetContent";

////////////////////////////////////////////////////////////////////////////////////
// Handle — 자체 bottomSheetHandle recipe 사용 (Root context 비의존)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetHandleProps extends HeadlessBottomSheetHandleProps {}

/**
 * @remarks
 * `SheetHandle`은 forwardRef가 아니므로 ref 시그니처는 제공하지 않는다.
 * Lynx drag handler는 `SheetHandle`의 outer view에 붙으므로, 44x44 target
 * area는 `SheetHandle`에 적용하고 보이는 handle은 그 중심에 배치한다.
 */
export function BottomSheetHandle(props: BottomSheetHandleProps): ReactElement {
  const { children, className, style, ...rest } = props;
  const classNames = bottomSheetHandle();

  return (
    <HeadlessBottomSheetHandle className={classNames.touchArea} {...rest}>
      <view className={clsx(classNames.root, className)} style={style as never}>
        {children}
      </view>
    </HeadlessBottomSheetHandle>
  );
}
BottomSheetHandle.displayName = "BottomSheetHandle";

////////////////////////////////////////////////////////////////////////////////////
// Header / Body / Footer / Title / Description — 네이티브 view/text + 슬롯 className
//
// 주의: 네이티브 `<view>`/`<text>` 슬롯은 `withContext`를 사용하면 안 된다.
// `withContext("view", ...)`는 `React.createElement(Component)` 형태로 컴파일되어
// Lynx 컴파일러의 리터럴 `<view>` 정적 분석을 우회하고 `BackgroundSnapshot not found`
// 런타임 에러를 유발한다. 반드시 리터럴 JSX로 `<view>`/`<text>`를 작성해야 한다.
// (lynx-ui-sheet 같은 외부 컴포넌트 감싸기엔 withContext를 그대로 사용해도 안전.)
////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetSlotProps extends LynxHostProps<"view"> {}

function createViewSlot(
  slotName: keyof BottomSheetClassNames,
): LynxForwardRefComponent<unknown, BottomSheetSlotProps> {
  const Slot = forwardRef<unknown, BottomSheetSlotProps>((props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <view
        {...mergeProps(
          { style: style as never },
          nativeProps,
          ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {},
        )}
        className={clsx(classNames[slotName], className)}
      >
        {children}
      </view>
    );
  });
  return Slot;
}

function createTextSlot(
  slotName: keyof BottomSheetClassNames,
): LynxForwardRefComponent<unknown, LynxHostProps<"text">> {
  const Slot = forwardRef<unknown, LynxHostProps<"text">>((props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <text
        {...mergeProps(
          { style: style as never },
          nativeProps,
          ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {},
        )}
        className={clsx(classNames[slotName], className)}
      >
        {children}
      </text>
    );
  });
  return Slot;
}

export interface BottomSheetHeaderProps extends BottomSheetSlotProps {}
export const BottomSheetHeader = createViewSlot("header");
BottomSheetHeader.displayName = "BottomSheetHeader";
export interface BottomSheetBodyProps extends BottomSheetSlotProps {}
export const BottomSheetBody = createViewSlot("body");
BottomSheetBody.displayName = "BottomSheetBody";

export interface BottomSheetFooterProps extends BottomSheetSlotProps {}
export const BottomSheetFooter = createViewSlot("footer");
BottomSheetFooter.displayName = "BottomSheetFooter";

export interface BottomSheetTitleProps extends LynxHostProps<"text"> {}
export const BottomSheetTitle = createTextSlot("title");
BottomSheetTitle.displayName = "BottomSheetTitle";

export interface BottomSheetDescriptionProps extends LynxHostProps<"text"> {}
export const BottomSheetDescription = createTextSlot("description");
BottomSheetDescription.displayName = "BottomSheetDescription";
