import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxPressableProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { useStyleProps, type StyleProps } from "../../utils/styled";

/**
 * @platform Lynx
 *
 * `AspectRatio`는 콘텐츠를 지정한 가로:세로 비율로 유지하는 레이아웃 primitive입니다.
 * `overflow`는 기본적으로 `hidden`이라 비율 박스를 넘는 자식은 잘립니다.
 *
 * 웹 버전은 iOS 15 미만 호환을 위해 `::before` + `padding-bottom` 트릭을 사용하지만,
 * Lynx는 native `aspect-ratio` CSS를 지원하므로 이를 직접 사용합니다. (Lynx는 스타일
 * 적용 단계에서 pseudo-element(`::before`)를 지원하지 않습니다.)
 *
 * radius/stroke 같은 프레임 스타일은 AspectRatio가 아니라 `ImageFrame`이 담당합니다.
 */
export interface AspectRatioProps extends StyleProps, LynxStyledElementProps, LynxPressableProps {
  /**
   * 가로 / 세로 비율 (width / height)
   * @default 4 / 3
   */
  ratio?: number;
  /** @default "hidden" */
  overflowX?: StyleProps["overflowX"];
  /** @default "hidden" */
  overflowY?: StyleProps["overflowY"];
  bindtouchstart?: () => void;
  bindtouchend?: () => void;
  bindtouchcancel?: () => void;
}

export const AspectRatio = React.forwardRef<unknown, AspectRatioProps>((props, ref) => {
  const { ratio = 4 / 3, overflowX = "hidden", overflowY = "hidden", ...rest } = props;
  const { style, restProps } = useStyleProps({ ...rest, overflowX, overflowY });
  const { children, className, ...nativeProps } = restProps;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(className)}
      style={{ ...style, aspectRatio: String(ratio) }}
    >
      {children}
    </view>
  );
});

AspectRatio.displayName = "AspectRatio";
