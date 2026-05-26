import * as React from "@lynx-js/react";
import clsx from "clsx";
import { tagGroup, type TagGroupVariantProps } from "@seed-design/lynx-css/recipes/tag-group";
import {
  tagGroupItem,
  type TagGroupItemVariantProps,
} from "@seed-design/lynx-css/recipes/tag-group-item";

import type { LynxStyledElementProps, LynxTextRef, LynxViewRef } from "../../types";
import { toArray } from "../../utils/children";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";
import { useStyleProps, type StyleProps } from "../../utils/styled";

const { PropsProvider, useProps, ClassNamesProvider, useClassNames } =
  createSlotRecipeContext(tagGroupItem);

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `truncate` prop: Lynx flex 모델에서는 item 단위 wrap만 가능해 웹 수준의
 *   "한 줄 유지 + label ellipsis" 조합을 재현할 수 없음
 * - `asChild` prop: Lynx Slot 미지원
 * - 아이콘 slot: Lynx 3.7 SVG 지원 후 검토 (Tier B)
 */
export interface TagGroupRootProps
  extends TagGroupVariantProps,
    TagGroupItemVariantProps,
    LynxStyledElementProps {
  /**
   * children 사이에 삽입되는 구분자. 기본값 `" · "`.
   */
  separator?: React.ReactNode;
}

export const TagGroupRoot = React.forwardRef<unknown, TagGroupRootProps>((props, ref) => {
  const [{ tagGroup: tagGroupVariantProps, tagGroupItem: tagGroupItemVariantProps }, otherProps] =
    splitMultipleVariantsProps(props, { tagGroup, tagGroupItem });
  const { children, className, separator = " · ", ...nativeProps } = otherProps;
  const classes = tagGroup(tagGroupVariantProps);

  const visibleChildren = toArray(children);

  return (
    <PropsProvider value={tagGroupItemVariantProps}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {visibleChildren.map((child, index) => {
          if (index === 0) return child;
          // Lynx <text> separator는 개별 flex item이라 wrap이 발동하면 separator가
          // 이전 row 끝에 남는다. separator와 뒤따르는 item을 하나의 flex-row wrapper로
          // 묶어 같은 wrap 단위로 함께 이동시킨다.
          return (
            <view
              key={(child as React.ReactElement).key ?? index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <text className={classes.separator}>{separator}</text>
              {child}
            </view>
          );
        })}
      </view>
    </PropsProvider>
  );
});
TagGroupRoot.displayName = "TagGroupRoot";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `asChild` prop: Lynx Slot 미지원
 */
export interface TagGroupItemProps
  extends TagGroupItemVariantProps,
    Pick<StyleProps, "flexShrink">,
    LynxStyledElementProps {}

export const TagGroupItem = React.forwardRef<unknown, TagGroupItemProps>((props, ref) => {
  const parentVariantProps = useProps();
  const [localVariantProps, otherProps] = tagGroupItem.splitVariantProps(props);
  const classes = tagGroupItem({ ...parentVariantProps, ...localVariantProps });
  const { style, restProps } = useStyleProps(otherProps);
  const { children, className, ...nativeProps } = restProps;

  return (
    <ClassNamesProvider value={classes}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.root, className)}
        style={style}
        {...nativeProps}
      >
        {children}
      </view>
    </ClassNamesProvider>
  );
});
TagGroupItem.displayName = "TagGroupItem";

////////////////////////////////////////////////////////////////////////////////////

export interface TagGroupItemLabelProps extends LynxStyledElementProps {}

export const TagGroupItemLabel = React.forwardRef<unknown, TagGroupItemLabelProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.label, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
TagGroupItemLabel.displayName = "TagGroupItemLabel";
