import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxPressableProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { useStyleProps, type StyleProps } from "../../utils/styled";

/**
 * @platform Lynx
 *
 * `Box`는 SEED style prop을 native `<view>`의 object style로 변환하는 편의
 * primitive입니다. 많은 항목을 반복 렌더링하는 화면에서는 primitive 컴포넌트
 * 렌더링과 style prop 해석 비용이 누적될 수 있습니다. 패키지 컴포넌트 내부나
 * 성능에 민감한 리스트에서는 native `<view>`와 recipe className 또는 명시적인
 * style을 우선 사용하세요.
 */
export interface BoxProps extends StyleProps, LynxStyledElementProps, LynxPressableProps {
  bindtouchstart?: () => void;
  bindtouchend?: () => void;
  bindtouchcancel?: () => void;
}

export const Box = React.forwardRef<unknown, BoxProps>((props, ref) => {
  const { style, restProps } = useStyleProps(props);
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
});

Box.displayName = "Box";
