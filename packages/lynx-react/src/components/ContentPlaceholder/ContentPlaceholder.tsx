import {
  contentPlaceholder,
  type ContentPlaceholderVariantProps,
} from "@seed-design/lynx-css/recipes/content-placeholder";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxStyledElementProps,
  LynxViewRef,
} from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { useStyleProps, type StyleProps } from "../../utils/styled";

/** Precolored light/dark images imported from a content-placeholder-presets subpath. */
export interface ContentPlaceholderPreset {
  readonly light: string;
  readonly dark: string;
}

const PresetContext = React.createContext<{ preset?: ContentPlaceholderPreset } | null>(null);

// withProvider/withContext는 intrinsic tag를 감싸지 못하므로(Lynx BackgroundSnapshot 제약),
// ClassNamesProvider + useClassNames로 slot className만 공유하고 native <view>는 literal로 렌더한다.
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(contentPlaceholder);

/** @platform Lynx */
export interface ContentPlaceholderRootProps
  extends ContentPlaceholderVariantProps,
    StyleProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  /** 표시할 프리셋. 생략하면 children으로 전달한 커스텀 에셋만 표시합니다. */
  preset?: ContentPlaceholderPreset;
}

export const ContentPlaceholderRoot = React.forwardRef<unknown, ContentPlaceholderRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = contentPlaceholder.splitVariantProps(props);
    const classNames = contentPlaceholder(variantProps);
    const { style, restProps } = useStyleProps(otherProps);
    const { children, className, preset, ...nativeProps } = restProps;

    return (
      <ClassNamesProvider value={classNames}>
        <PresetContext.Provider value={{ preset }}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            className={clsx(classNames.root, className)}
            style={style}
          >
            {children}
          </view>
        </PresetContext.Provider>
      </ClassNamesProvider>
    );
  },
);

ContentPlaceholderRoot.displayName = "ContentPlaceholderRoot";

/** Custom assets own their color. Pass an initial tint-color to monochrome icons. */
export interface ContentPlaceholderAssetProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps {}

export const ContentPlaceholderAsset = React.forwardRef<unknown, ContentPlaceholderAssetProps>(
  (props, ref) => {
    const classNames = useClassNames();
    const context = React.useContext(PresetContext);
    if (!context)
      throw new Error("ContentPlaceholder.Asset must be rendered inside ContentPlaceholder.Root.");
    const { preset } = context;
    const { children, className, ...nativeProps } = props;
    const isElement = React.isValidElement<LynxIconElementProps>(children);
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
        {asset ||
          (preset && (
            <>
              <image
                src={preset.light}
                mode="aspectFit"
                className={classNames.presetLight}
                accessibility-elements-hidden
              />
              <image
                src={preset.dark}
                mode="aspectFit"
                className={classNames.presetDark}
                accessibility-elements-hidden
              />
            </>
          ))}
      </view>
    );
  },
);
ContentPlaceholderAsset.displayName = "ContentPlaceholderAsset";
