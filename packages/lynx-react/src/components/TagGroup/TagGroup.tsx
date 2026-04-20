import * as React from "react";
import { Fragment } from "@lynx-js/react";
import clsx from "clsx";
import { tagGroup, type TagGroupVariantProps } from "@seed-design/lynx-css/recipes/tag-group";
import {
  tagGroupItem,
  type TagGroupItemVariantProps,
} from "@seed-design/lynx-css/recipes/tag-group-item";

import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { splitMultipleVariantsProps } from "../../utils/split-multiple-variants-props";

const { PropsProvider, useProps, ClassNamesProvider, withContext } =
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
        {visibleChildren.map((child, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: separator fragments are stable in source order
          <Fragment key={index}>
            {index > 0 && <text className={classes.separator}>{separator}</text>}
            {child}
          </Fragment>
        ))}
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
 */
export interface TagGroupItemProps extends TagGroupItemVariantProps {
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

export const TagGroupItemLabel = withContext<unknown, TagGroupItemLabelProps>("text", "label");
TagGroupItemLabel.displayName = "TagGroupItemLabel";
