import {
  identityPlaceholder,
  type IdentityPlaceholderVariantProps,
} from "@seed-design/lynx-css/recipes/identity-placeholder";
import type { NodesRef } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import type { LynxHostProps, LynxViewRef } from "../../types";
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
 * 웹 대비 미지원 기능:
 * - HTML div 속성 및 ARIA 속성
 * - `asChild`
 */
export interface IdentityPlaceholderRootProps
  extends IdentityPlaceholderVariantProps,
    LynxHostProps<"view"> {}

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
 * Web SVG props 대신 native image props를 사용하며 SVG rendering과 `asChild`는
 * 지원하지 않습니다. identity variant의 기본 `src`와 `mode`는 사용자 props로 덮을 수 있습니다.
 *
 * React SVG의 기본 `xMidYMid meet`처럼 도형 전체를 비율을 유지한 채 영역 안에 맞춥니다.
 *
 * 로컬 WebP는 `static-white-alpha-800`의 고정값 `#ffffffde`로 원본 SVG path를
 * rasterize합니다. Native image의 SVG/fill 경로를 피하고, 토큰이 light/dark에서
 * 동일하므로 동적 tint를 사용하지 않습니다.
 */
export interface IdentityPlaceholderImageProps extends Omit<LynxHostProps<"image">, "children"> {}

export const IdentityPlaceholderImage = React.forwardRef<unknown, IdentityPlaceholderImageProps>(
  (props, ref) => {
    const classNames = useClassNames();
    const parentProps = useProps();

    const { className, ...nativeProps } = props;
    const identity = parentProps?.identity ?? "person";

    return (
      <image
        {...mergeProps(
          {
            src: identitySources[identity],
            mode: "aspectFit",
            "accessibility-label": "Identity placeholder",
            "accessibility-traits": "image",
          } as const,
          ref ? { ref: ref as React.Ref<NodesRef> } : {},
          nativeProps,
        )}
        className={clsx(classNames.image, className)}
      />
    );
  },
);
IdentityPlaceholderImage.displayName = "IdentityPlaceholderImage";
