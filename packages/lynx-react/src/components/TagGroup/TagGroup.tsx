import * as React from "react";
import clsx from "clsx";
import { tagGroup, type TagGroupVariantProps } from "@seed-design/lynx-css/recipes/tag-group";
import {
  tagGroupItem,
  type TagGroupItemVariantProps,
} from "@seed-design/lynx-css/recipes/tag-group-item";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";

const { PropsProvider, useProps, ClassNamesProvider, useClassNames } =
  createSlotRecipeContext(tagGroupItem);

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - flexShrink prop: CSS variable 동적 주입 제한
 * - asChild prop: Lynx Slot 미지원
 * - 아이콘 slot: Lynx 3.7 SVG 지원 후 검토 (Tier B)
 */
export interface TagGroupRootProps extends TagGroupVariantProps, TagGroupItemVariantProps {
  children?: React.ReactNode;
  className?: string;
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

  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.filter((child) => child != null && child !== false);

  return (
    <PropsProvider value={tagGroupItemVariantProps}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {visibleChildren.map((child, index) => {
          if (index === 0) {
            // biome-ignore lint/suspicious/noArrayIndexKey: first-item slot is stable in source order
            return <view key={index}>{child}</view>;
          }
          // Lynx에서는 <text> separator가 개별 flex item으로 취급되기 때문에
          // wrap이 발동하면 separator가 이전 row 끝에 남게 된다. separator와
          // 뒤따르는 item을 하나의 flex-row wrapper로 묶어 같은 wrap 단위로
          // 이동시킨다.
          return (
            <view
              // biome-ignore lint/suspicious/noArrayIndexKey: child slots are stable in source order
              key={index}
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

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - flexShrink prop: CSS variable 동적 주입 제한
 * - asChild prop: Lynx Slot 미지원
 *
 * `truncate`는 `TagGroupRoot`의 prop이므로 Item에는 노출하지 않는다.
 * Context로 전달받은 값이 자동으로 반영된다.
 */
export interface TagGroupItemProps extends Omit<TagGroupItemVariantProps, "truncate"> {
  children?: React.ReactNode;
  className?: string;
}

export const TagGroupItem = React.forwardRef<unknown, TagGroupItemProps>((props, ref) => {
  const parentVariantProps = useProps();
  const [localVariantProps, otherProps] = tagGroupItem.splitVariantProps(props);
  const classes = tagGroupItem({ ...parentVariantProps, ...localVariantProps });
  const { children, className, ...nativeProps } = otherProps;

  return (
    <ClassNamesProvider value={classes}>
      <view
        {...(ref ? { ref: ref as React.Ref<SVGViewElement> } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
      >
        {children}
      </view>
    </ClassNamesProvider>
  );
});
TagGroupItem.displayName = "TagGroupItem";

export interface TagGroupItemLabelProps {
  children?: React.ReactNode;
  className?: string;
}

export const TagGroupItemLabel = React.forwardRef<unknown, TagGroupItemLabelProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as React.Ref<SVGTextElement> } : {})}
      className={clsx(classes.label, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
TagGroupItemLabel.displayName = "TagGroupItemLabel";
