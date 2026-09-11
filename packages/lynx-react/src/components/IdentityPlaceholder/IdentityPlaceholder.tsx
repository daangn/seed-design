import {
  identityPlaceholder,
  type IdentityPlaceholderVariantProps,
} from "@seed-design/lynx-css/recipes/identity-placeholder";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxStyledElementProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import businessSource from "./identity-placeholder-business.webp";
import personSource from "./identity-placeholder-person.webp";

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(identityPlaceholder);

type Identity = NonNullable<IdentityPlaceholderVariantProps["identity"]>;

const identitySources = {
  person: personSource,
  business: businessSource,
} satisfies Record<Identity, string>;

/**
 * @platform Lynx
 *
 * Web의 SVG/asChild API 대신 native `<view>` props를 받습니다.
 */
export interface IdentityPlaceholderRootProps
  extends IdentityPlaceholderVariantProps,
    LynxStyledElementProps {}

export const IdentityPlaceholderRoot = React.forwardRef<unknown, IdentityPlaceholderRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = identityPlaceholder.splitVariantProps(props);
    const { children, className, style, ...nativeProps } = otherProps;
    const classNames = identityPlaceholder(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <PropsProvider value={variantProps}>
          <view
            {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
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
IdentityPlaceholderRoot.displayName = "IdentityPlaceholderRoot";

/**
 * @platform Lynx
 *
 * `src`와 `mode`는 identity variant가 소유합니다. Web SVG props 대신 native image
 * props를 사용하며 SVG rendering과 `asChild`는 지원하지 않습니다.
 *
 * React SVG의 기본 `xMidYMid meet`처럼 도형 전체를 비율을 유지한 채 영역 안에 맞춥니다.
 *
 * 로컬 WebP는 `static-white-alpha-800`의 고정값 `#ffffffde`로 원본 SVG path를
 * rasterize합니다. Native image의 SVG/fill 경로를 피하고, 토큰이 light/dark에서
 * 동일하므로 동적 tint를 사용하지 않습니다.
 */
export interface IdentityPlaceholderImageProps
  extends Omit<IntrinsicElements["image"], "src" | "mode" | "children"> {}

export const IdentityPlaceholderImage = React.forwardRef<unknown, IdentityPlaceholderImageProps>(
  (props, ref) => {
    const classNames = useClassNames();
    const parentProps = useProps();

    if (parentProps === null) {
      throw new Error(
        "<IdentityPlaceholderImage/> must be rendered inside <IdentityPlaceholderRoot/>.",
      );
    }

    const {
      className,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const identity = parentProps.identity ?? "person";

    return (
      <image
        {...mergeProps(ref ? { ref: ref as React.Ref<NodesRef> } : {}, nativeProps)}
        src={identitySources[identity]}
        mode="aspectFit"
        accessibility-label={accessibilityLabel ?? "Identity placeholder"}
        accessibility-traits={accessibilityTraits ?? "image"}
        className={clsx(classNames.image, className)}
      />
    );
  },
);
IdentityPlaceholderImage.displayName = "IdentityPlaceholderImage";
