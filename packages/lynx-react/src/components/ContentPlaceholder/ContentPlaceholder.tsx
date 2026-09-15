import { contentPlaceholder } from "@seed-design/lynx-css/recipes/content-placeholder";
import clsx from "clsx";
import type { MainThread } from "@lynx-js/types";
import * as React from "@lynx-js/react";

import type {
  LynxIconElementProps,
  LynxMainThreadRef,
  LynxStyledElementProps,
  LynxViewRef,
} from "../../types";
import { useIconColor } from "../../hooks/useIconColor";
import { mergeProps } from "../../utils/merge-props";
import { mergeMainThreadRefs } from "../../utils/merge-refs";
import { getIconSlotName, isMulticolorIcon } from "../Icon/Icon";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { useStyleProps, type StyleProps } from "../../utils/styled";

// withProvider/withContext는 intrinsic tag를 감싸지 못하므로(Lynx BackgroundSnapshot 제약),
// ClassNamesProvider + useClassNames로 slot className만 공유하고 native <view>는 literal로 렌더한다.
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(contentPlaceholder);

/**
 * @platform Lynx
 *
 * `ContentPlaceholder`는 이미지/콘텐츠가 없거나 로딩 전인 영역을 채우는 플레이스홀더다.
 * 배경 박스(`Root`)와 중앙 정렬된 asset 박스(`Asset`)로 구성되며, asset에는 아이콘이나
 * 이미지를 children으로 넣는다.
 *
 * 웹 `@seed-design/react`의 ContentPlaceholder는 `type` 프리셋(default/car/food 등 전용
 * 일러스트 SVG)을 제공하지만, Lynx는 해당 SVG를 포팅하지 않고 소비자가
 * `@karrotmarket/lynx-monochrome-icon` 같은 아이콘이나 이미지를 Asset의 children으로 직접 주입한다.
 */
export interface ContentPlaceholderRootProps extends StyleProps, LynxStyledElementProps {}

export const ContentPlaceholderRoot = React.forwardRef<unknown, ContentPlaceholderRootProps>(
  (props, ref) => {
    const classNames = contentPlaceholder();
    const { style, restProps } = useStyleProps(props);
    const { children, className, ...nativeProps } = restProps;

    return (
      <ClassNamesProvider value={classNames}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          className={clsx(classNames.root, className)}
          style={style}
        >
          {children}
        </view>
      </ClassNamesProvider>
    );
  },
);

ContentPlaceholderRoot.displayName = "ContentPlaceholderRoot";

export interface ContentPlaceholderAssetProps extends LynxStyledElementProps {
  /**
   * 커스텀 아이콘의 원래 색상을 유지합니다. SEED 멀티컬러 아이콘은 기본적으로 유지합니다.
   * 직접 전달한 native <image>는 복제하지 않고 원래 props 그대로 렌더합니다.
   * 커스텀 아이콘은 className, style, ref와 main-thread:binduiappear를 실제 image에 전달해야 합니다.
   */
  preserveOriginalColor?: boolean;
}

export const ContentPlaceholderAsset = React.forwardRef<unknown, ContentPlaceholderAssetProps>(
  (props, ref) => {
    const classNames = useClassNames();
    const { children, className, preserveOriginalColor, ...nativeProps } = props;
    const sourceRef = React.useMainThreadRef<MainThread.Element>(null);
    const isElement = React.isValidElement<LynxIconElementProps>(children);
    // Intrinsic elements are compiled snapshots, not ordinary cloneable icon components.
    const isNativeElement = isElement && typeof children.type === "string";
    const isWrappedIcon = getIconSlotName(children) !== null;
    const shouldPreserveColor = preserveOriginalColor ?? isMulticolorIcon(children);
    const iconColor = useIconColor([classNames.asset, className, nativeProps.style?.color], {
      sourceRef,
      enabled: isElement && !isNativeElement && !shouldPreserveColor && !isWrappedIcon,
    });

    if (
      children != null &&
      children !== false &&
      (!isElement || children.type === React.Fragment)
    ) {
      throw new Error("ContentPlaceholder.Asset expects a single icon or image element.");
    }

    let asset = children;
    if (isElement && !isNativeElement && !isWrappedIcon) {
      const dimensions = { style: { width: "100%", height: "100%" } };
      if (shouldPreserveColor) {
        asset = React.cloneElement(children, mergeProps(children.props, dimensions));
      } else {
        const { ref: tintRef, ...tintEvents } = iconColor;
        const childRef = (children as { ref?: LynxMainThreadRef }).ref ?? children.props.ref;
        asset = React.cloneElement(children, {
          ...mergeProps(tintEvents, children.props, dimensions),
          // Icon components forward this ref to their image's main-thread:ref.
          ref: childRef ? mergeMainThreadRefs(tintRef, childRef) : tintRef,
        });
      }
    }

    return (
      <view
        {...mergeProps(
          { "main-thread:ref": sourceRef },
          ref ? { ref: ref as LynxViewRef } : {},
          nativeProps,
        )}
        className={clsx(classNames.asset, className)}
      >
        {asset}
      </view>
    );
  },
);

ContentPlaceholderAsset.displayName = "ContentPlaceholderAsset";
