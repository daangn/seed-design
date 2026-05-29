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
 * 최소 flex style만 적용합니다. 의도적으로 `Box`를 조합하지 않으므로, 패키지
 * 컴포넌트가 반복 레이아웃에서 primitive 컴포넌트 비용을 더 만들지 않도록
 * 도와줍니다.
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
  return useStyleProps({
    display: "flex",
    flexDirection,
    ...getStackProps(props),
  });
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
