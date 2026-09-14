import { skeleton, type SkeletonVariantProps } from "@seed-design/lynx-css/recipes/skeleton";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxStyledElementProps, LynxViewRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { useStyleProps, type StyleProps } from "../../utils/styled";

/**
 * @platform Lynx
 *
 * 웹 Skeleton의 정적 placeholder를 native `<view>` root와 shimmer child로
 * 렌더링합니다. 장식 요소이므로 접근성 트리에서 숨겨지며, children이나 이벤트·상태
 * API를 노출하지 않습니다.
 */
export interface SkeletonProps
  extends SkeletonVariantProps,
    Omit<LynxStyledElementProps, "children">,
    Pick<StyleProps, "width" | "height"> {}

export const Skeleton = React.forwardRef<unknown, SkeletonProps>((props, ref) => {
  const [variantProps, otherProps] = skeleton.splitVariantProps(props);
  const { style, restProps } = useStyleProps(otherProps);
  const {
    children: _children,
    className,
    ...nativeProps
  } = restProps as typeof restProps & {
    children?: unknown;
  };
  const classes = skeleton(variantProps);

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.root, className)}
      style={style}
      accessibility-elements-hidden={true}
    >
      <view className={classes.shimmer} accessibility-elements-hidden={true} />
    </view>
  );
});

Skeleton.displayName = "Skeleton";
