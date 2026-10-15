import {
  bottomSheet,
  type BottomSheetVariantProps,
} from "@seed-design/lynx-css/recipes/bottom-sheet";
import { bottomSheetHandle } from "@seed-design/lynx-css/recipes/bottom-sheet-handle";
import { bottomSheet as bottomSheetVars } from "@seed-design/lynx-css/vars/component";
import {
  BottomSheetBackdrop as HeadlessBottomSheetBackdrop,
  BottomSheetContent as HeadlessBottomSheetContent,
  BottomSheetHandle as HeadlessBottomSheetHandle,
  BottomSheetPositioner as HeadlessBottomSheetPositioner,
  BottomSheetRoot as HeadlessBottomSheetRoot,
  useBottomSheetCloseButton,
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
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactElement,
  type RefAttributes,
} from "@lynx-js/react";
import clsx from "clsx";

import { useSafeArea } from "../../hooks/useSafeArea";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { IconSlotProvider } from "../Icon/Icon";
import { useSheetScrollGestureProps } from "../private/SheetScrollGesture";

type BottomSheetClassNames = ReturnType<typeof bottomSheet>;
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;
type SheetTransition = NonNullable<HeadlessBottomSheetContentProps["snapAnimation"]>;

const { ClassNamesProvider, useClassNames, withContext } = createSlotRecipeContext(bottomSheet);

/** Root가 제목 여백을 정할 수 있도록 CloseButton이 렌더링 여부를 알린다. */
const CloseButtonRenderedContext = createContext<((rendered: boolean) => void) | null>(null);

/** 내용에 맞춰 높이가 정해지는 시트에만 Content가 높이 상한을 둔다. */
const FitsContentContext = createContext(false);

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
  extends Omit<BottomSheetVariantProps, "closeButton">,
    Omit<HeadlessBottomSheetRootProps, keyof BottomSheetVariantProps> {}

/**
 * @platform Lynx — `@seed-design/lynx-react-bottom-sheet` 위에 SEED recipe를 조립한다.
 *
 * 웹 대비 미지원 기능:
 * - `lazyMount`, `unmountOnExit`: `BottomSheetPositioner`의 `forceMount`로 대체
 * - `BottomSheetTrigger`의 `asChild`: 미지원 (기본 `<view>`만)
 */
export const BottomSheetRoot: LynxForwardRefComponent<BottomSheetRootRef, BottomSheetRootProps> =
  forwardRef<BottomSheetRootRef, BottomSheetRootProps>((props, ref) => {
    const [variantProps, restProps] = bottomSheet.splitVariantProps(props);
    const { children, ...rootProps } = restProps;
    const { headerAlign, skipAnimation } = variantProps;
    const [closeButtonRendered, setCloseButtonRendered] = useState(false);
    const globalProps = lynx.__globalProps;
    const hostScreenHeight =
      globalProps && "screenHeight" in globalProps && typeof globalProps.screenHeight === "number"
        ? globalProps.screenHeight
        : undefined;
    // host가 화면 높이를 주지 않아도 엔진의 500px 기본값 대신 기기의 논리 높이를 쓴다.
    const screenHeight =
      rootProps.screenHeight ??
      hostScreenHeight ??
      (typeof SystemInfo !== "undefined" && SystemInfo.pixelHeight > 0 && SystemInfo.pixelRatio > 0
        ? SystemInfo.pixelHeight / SystemInfo.pixelRatio
        : undefined);

    const classNames = useMemo(
      () => bottomSheet({ ...variantProps, closeButton: closeButtonRendered }),
      // variantProps 객체는 매 렌더 새로 생성되므로 개별 variant 값으로 의존성을 고정한다.
      [headerAlign, skipAnimation, closeButtonRendered],
    );
    const fitsContent = (rootProps.snapPoints ?? ["fit"]).some(
      (point) => String(point).trim() === "fit",
    );

    return (
      <ClassNamesProvider value={classNames}>
        <CloseButtonRenderedContext.Provider value={setCloseButtonRendered}>
          <FitsContentContext.Provider value={fitsContent}>
            <HeadlessBottomSheetRoot
              {...(ref ? { ref } : {})}
              {...rootProps}
              screenHeight={screenHeight}
              skipAnimation={skipAnimation === true}
            >
              {children}
            </HeadlessBottomSheetRoot>
          </FitsContentContext.Provider>
        </CloseButtonRenderedContext.Provider>
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
    const fitsContent = useContext(FitsContentContext);
    const { safeAreaInsetTop, safeAreaInsetRight, safeAreaInsetBottom, safeAreaInsetLeft } =
      useSafeArea();

    return (
      <HeadlessBottomSheetContent
        {...mergeProps(ref ? { ref } : {}, restProps)}
        className={clsx(classNames.content, className)}
        // `SheetContent` pins its outer view with an inline `left: 0` and `width: 100vw`, which a
        // recipe class cannot outrank. Releasing `left` lets the positioner's
        // `justify-content: center` place the sheet. Lynx ignores the positioner's padding when
        // centering an absolute child but centers its margin box, so the side insets go on as
        // margins and come off the width. `transform` is off-limits here — the main-thread motion
        // engine owns it.
        style={{
          left: "auto",
          width: `calc(100vw - ${safeAreaInsetLeft} - ${safeAreaInsetRight})`,
          marginLeft: safeAreaInsetLeft,
          marginRight: safeAreaInsetRight,
          // Lynx has no `min()`, so the two height caps are stacked: this padding leaves the inner
          // view `100vh - top` of the outer view's `150vh` (set by `SheetContent`) to shrink into,
          // and the inner `maxHeight` holds the fraction. Explicit snap points size the inner view
          // themselves, so the caps apply only to a fitted sheet.
          ...(fitsContent && { paddingBottom: `calc(50vh + ${safeAreaInsetTop})` }),
          ...style,
        }}
        innerStyle={{
          display: "flex",
          flexDirection: "column",
          minHeight: "0",
          ...(fitsContent && {
            flexShrink: 1,
            maxHeight: `calc(${bottomSheetVars.base.enabled.content.maxHeightFraction} * 100vh)`,
          }),
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

/**
 * Scrolls once the sheet reaches its max height. `className` and `style` go on the view around the
 * `scroll-view`.
 */
export const BottomSheetBody: LynxForwardRefComponent<unknown, BottomSheetBodyProps> = forwardRef<
  unknown,
  BottomSheetBodyProps
>((props, ref) => {
  const { children, className, style } = props;
  const classNames = useClassNames();
  const gestureProps = useSheetScrollGestureProps();

  return (
    <view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      className={clsx(classNames.body, className)}
      style={style as never}
    >
      <scroll-view
        {...gestureProps}
        className={classNames.scrollArea}
        scroll-orientation="vertical"
        // The sheet's drag already moves it at the body's edges; a bounce would add to that.
        bounces={false}
      >
        <view className={classNames.scrollContent}>{children}</view>
      </scroll-view>
    </view>
  );
});
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

////////////////////////////////////////////////////////////////////////////////////
// CloseButton
////////////////////////////////////////////////////////////////////////////////////

// 보이는 버튼(28px) 주위로 터치 영역을 bottom-sheet-close-button의 targetSize(44px)까지 넓힌다.
const CLOSE_BUTTON_HIT_SLOP = "8px";

export interface BottomSheetCloseButtonProps extends LynxHostProps<"view"> {}

/**
 * 탭하면 시트를 닫고 `onOpenChange`에 `"closeButton"` reason을 전달한다.
 * Content 오른쪽 위에 놓이며, 렌더링되는 동안 Title이 버튼 자리만큼 여백을 둔다.
 * 아이콘은 `<Icon>`으로 전달하고, 읽어줄 이름은 `accessibility-label`로 지정한다.
 */
export const BottomSheetCloseButton: LynxForwardRefComponent<unknown, BottomSheetCloseButtonProps> =
  forwardRef<unknown, BottomSheetCloseButtonProps>((props, ref) => {
    const { children, className, style, bindtap, ...nativeProps } = props;
    const classNames = useClassNames();
    const setCloseButtonRendered = useContext(CloseButtonRenderedContext);
    const { closeButtonProps } = useBottomSheetCloseButton({ bindtap });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();
    const iconSlotContextValue = useMemo(
      () => ({
        classNames: { icon: classNames.closeButtonIcon },
        deps: [classNames.closeButtonIcon],
      }),
      [classNames.closeButtonIcon],
    );

    useLayoutEffect(() => {
      setCloseButtonRendered?.(true);
      return () => setCloseButtonRendered?.(false);
    }, [setCloseButtonRendered]);

    return (
      <IconSlotProvider value={iconSlotContextValue}>
        <view
          {...mergeProps(
            {
              "accessibility-element": true,
              "accessibility-traits": "button",
              "hit-slop": CLOSE_BUTTON_HIT_SLOP,
              style: style as never,
            },
            closeButtonProps,
            scaleFeedbackTriggerProps,
            scaleFeedbackTargetProps,
            nativeProps,
            ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {},
          )}
          className={clsx(classNames.closeButton, className)}
        >
          {children}
        </view>
      </IconSlotProvider>
    );
  });
BottomSheetCloseButton.displayName = "BottomSheetCloseButton";
