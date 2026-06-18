import { contentPlaceholder } from "@seed-design/lynx-css/recipes/content-placeholder";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxStyledElementProps, LynxViewRef } from "../../types";
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

export interface ContentPlaceholderAssetProps extends LynxStyledElementProps {}

export const ContentPlaceholderAsset = React.forwardRef<unknown, ContentPlaceholderAssetProps>(
  (props, ref) => {
    const classNames = useClassNames();
    const { children, className, ...nativeProps } = props;

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classNames.asset, className)}
      >
        {children}
      </view>
    );
  },
);

ContentPlaceholderAsset.displayName = "ContentPlaceholderAsset";
