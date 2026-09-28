import {
  contentPlaceholder,
  type ContentPlaceholderVariantProps,
} from "@seed-design/lynx-css/recipes/content-placeholder";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxIconElementProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { useStyleProps, type StyleProps } from "../../utils/styled";

import { contentPlaceholderPresets } from "./presets";

// withProvider/withContext는 intrinsic tag를 감싸지 못하므로(Lynx BackgroundSnapshot 제약),
// ClassNamesProvider + useClassNames로 slot className만 공유하고 native <view>는 literal로 렌더한다.
const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(contentPlaceholder);

/** @platform Lynx */
export interface ContentPlaceholderRootProps
  extends ContentPlaceholderVariantProps,
    StyleProps,
    LynxStyledElementProps {}

export const ContentPlaceholderRoot = React.forwardRef<unknown, ContentPlaceholderRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = contentPlaceholder.splitVariantProps(props);
    const classNames = contentPlaceholder(variantProps);
    const { style, restProps } = useStyleProps(otherProps);
    const { children, className, ...nativeProps } = restProps;

    return (
      <ClassNamesProvider value={classNames}>
        <PropsProvider value={variantProps}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            className={clsx(classNames.root, className)}
            style={style}
          >
            {children}
          </view>
        </PropsProvider>
      </ClassNamesProvider>
    );
  },
);

ContentPlaceholderRoot.displayName = "ContentPlaceholderRoot";

/** Custom assets own their color. Pass an initial tint-color to monochrome icons. */
export interface ContentPlaceholderAssetProps extends LynxStyledElementProps {}

export const ContentPlaceholderAsset = React.forwardRef<unknown, ContentPlaceholderAssetProps>(
  (props, ref) => {
    const classNames = useClassNames();
    const parentProps = useProps();
    const { children, className, ...nativeProps } = props;
    const isElement = React.isValidElement<LynxIconElementProps>(children);
    if (
      children != null &&
      children !== false &&
      (!isElement || children.type === React.Fragment)
    ) {
      throw new Error("ContentPlaceholder.Asset expects a single icon or image element.");
    }
    const preset = contentPlaceholderPresets[parentProps?.type ?? "default"];
    const asset =
      isElement && typeof children.type !== "string"
        ? React.cloneElement(
            children,
            mergeProps(children.props, { style: { width: "100%", height: "100%" } }),
          )
        : children;

    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classNames.asset, className)}
      >
        {asset || (
          <>
            <image
              src={preset.light}
              mode="aspectFit"
              className={classNames.presetLight}
              accessibility-hidden
            />
            <image
              src={preset.dark}
              mode="aspectFit"
              className={classNames.presetDark}
              accessibility-hidden
            />
          </>
        )}
      </view>
    );
  },
);
ContentPlaceholderAsset.displayName = "ContentPlaceholderAsset";
