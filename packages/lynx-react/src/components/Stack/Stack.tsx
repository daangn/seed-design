import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxPressableProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { useStyleProps, type StyleProps } from "../../utils/styled";

type StackStyleProps =
  | "display"
  | "flexDirection"
  | "alignItems"
  | "justifyContent"
  | "flexWrap"
  | "flexGrow"
  | "flexShrink";

interface StackBaseProps extends StyleProps, LynxStyledElementProps, LynxPressableProps {
  bindtouchstart?: () => void;
  bindtouchend?: () => void;
  bindtouchcancel?: () => void;
}

/**
 * @platform Lynx
 *
 * `VStack`과 `HStack`은 native `<view>`를 직접 렌더링하고 stack 방향에 필요한
 * 최소 flex style만 적용합니다. 앱 코드에서 성능에 민감한 반복 레이아웃을 만들
 * 때는 native `<view>`/`<text>`와 Tailwind utility className을 우선 고려하세요.
 * 패키지 컴포넌트 내부에서는 `Box`를 합성하지 않고 native tag와 recipe className을
 * 사용해 primitive 컴포넌트 비용이 누적되지 않도록 합니다.
 */
export interface StackProps extends Omit<StackBaseProps, StackStyleProps> {
  align?: StackBaseProps["alignItems"];
  justify?: StackBaseProps["justifyContent"];
  wrap?: StackBaseProps["flexWrap"];
  grow?: StackBaseProps["flexGrow"];
  shrink?: StackBaseProps["flexShrink"];
}

export interface VStackProps extends StackProps {}

export interface HStackProps extends StackProps {}

function getStackProps(props: StackProps) {
  const { align, justify, wrap, grow, shrink, ...restProps } = props;

  return {
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexGrow: grow,
    flexShrink: shrink,
    ...restProps,
  };
}

function useStackStyleProps(props: StackProps, flexDirection: "column" | "row") {
  const stackStyleProps = useStyleProps({
    display: "flex",
    flexDirection,
    ...getStackProps(props),
  });
  // Lynx의 gap 단축 속성 파서는 var(...)를 0px로 확정하므로 축별 longhand를 사용합니다.
  const { gap, ...style } = stackStyleProps.style;

  if (gap == null) {
    return stackStyleProps;
  }

  return {
    ...stackStyleProps,
    style: {
      [flexDirection === "column" ? "rowGap" : "columnGap"]: gap,
      ...style,
    },
  };
}

function renderStackView(
  stackStyleProps: ReturnType<typeof useStackStyleProps>,
  ref: React.ForwardedRef<unknown>,
) {
  const { style, restProps } = stackStyleProps;
  const { children, className, ...nativeProps } = restProps;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(className)}
      style={style}
    >
      {children}
    </view>
  );
}

export const VStack = React.forwardRef<unknown, VStackProps>((props, ref) => {
  const stackStyleProps = useStackStyleProps(props, "column");

  return renderStackView(stackStyleProps, ref);
});

VStack.displayName = "VStack";

export const HStack = React.forwardRef<unknown, HStackProps>((props, ref) => {
  const stackStyleProps = useStackStyleProps(props, "row");

  return renderStackView(stackStyleProps, ref);
});

HStack.displayName = "HStack";
