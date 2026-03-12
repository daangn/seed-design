import {
  contentPlaceholder,
  type ContentPlaceholderVariantProps,
} from "@seed-design/css/recipes/content-placeholder";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { contentPlaceholderAssetPresetMap } from "./presets";
import { mergeProps } from "@seed-design/dom-utils";
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

export interface ContentPlaceholderAssetProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const ContentPlaceholderAsset = React.forwardRef<
  HTMLSpanElement,
  ContentPlaceholderAssetProps
>(({ children, className, ...props }, ref) => {
  const classNames = useClassNames();
  const parentProps = useProps();

  const asset = useMemo(() => {
    if (children) return children;

    return contentPlaceholderAssetPresetMap[parentProps?.type ?? "default"];
  }, [children, parentProps?.type]);

  return (
    <Primitive.span
      ref={ref}
      className={clsx(classNames.asset, className)}
      {...props}
    >
      {asset}
    </Primitive.span>
  );
});
ContentPlaceholderAsset.displayName = "ContentPlaceholderAsset";
