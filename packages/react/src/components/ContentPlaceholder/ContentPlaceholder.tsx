import {
  contentPlaceholder,
  type ContentPlaceholderVariantProps,
} from "@seed-design/css/recipes/content-placeholder";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider, withContext } = createSlotRecipeContext(contentPlaceholder);

export interface ContentPlaceholderRootProps
  extends ContentPlaceholderVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentPlaceholderRoot = withProvider<HTMLDivElement, ContentPlaceholderRootProps>(
  Primitive.div,
  "root",
);

export interface ContentPlaceholderContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ContentPlaceholderContainer = withContext<
  HTMLDivElement,
  ContentPlaceholderContainerProps
>(Primitive.div, "container");

export interface ContentPlaceholderAssetProps extends InternalIconProps {}

export const ContentPlaceholderAsset = withContext<SVGSVGElement, ContentPlaceholderAssetProps>(
  InternalIcon,
  "asset",
);
