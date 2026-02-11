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

export interface ContentPlaceholderIconProps extends InternalIconProps {}

export const ContentPlaceholderIcon = withContext<SVGSVGElement, ContentPlaceholderIconProps>(
  InternalIcon,
  "icon",
);
