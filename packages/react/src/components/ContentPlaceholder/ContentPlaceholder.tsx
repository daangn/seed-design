import {
  contentPlaceholder,
  type ContentPlaceholderVariantProps,
} from "@seed-design/css/recipes/content-placeholder";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { contentPlaceholderAssetPresetMap } from "./presets";
import { mergeProps } from "@seed-design/dom-utils";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { useMemo } from "react";

const { PropsProvider, ClassNamesProvider, useProps, useClassNames } = createSlotRecipeContext(
  contentPlaceholder,
);

export interface ContentPlaceholderRootProps
  extends ContentPlaceholderVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentPlaceholderRoot = React.forwardRef<HTMLDivElement, ContentPlaceholderRootProps>(
  (props, ref) => {
    const [variantProps, restProps] = contentPlaceholder.splitVariantProps(props);
    const classNames = contentPlaceholder(variantProps);

    return (
      <PropsProvider value={variantProps}>
        <ClassNamesProvider value={classNames}>
          <Primitive.div ref={ref} {...mergeProps({ className: classNames.root }, restProps)} />
        </ClassNamesProvider>
      </PropsProvider>
    );
  },
);

ContentPlaceholderRoot.displayName = "ContentPlaceholderRoot";

export interface ContentPlaceholderImageProps extends React.SVGProps<SVGSVGElement> {}

export const ContentPlaceholderImage = React.forwardRef<
  SVGSVGElement,
  ContentPlaceholderImageProps
>(({ children, className, ...props }, ref) => {
  const classNames = useClassNames();
  const parentProps = useProps();

  const image = useMemo(() => {
    if (children) return children;

    return contentPlaceholderAssetPresetMap[parentProps?.type ?? "default"];
  }, [children, parentProps?.type]);

  return (
    <Slot
      ref={ref as React.ForwardedRef<HTMLElement>}
      className={clsx(classNames.image, className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {image}
    </Slot>
  );
});
ContentPlaceholderImage.displayName = "ContentPlaceholderImage";
