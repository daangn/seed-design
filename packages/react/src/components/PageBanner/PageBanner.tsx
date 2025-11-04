import type * as React from "react";

import { pageBanner, type PageBannerVariantProps } from "@seed-design/css/recipes/page-banner";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import {
  DismissibleCloseButton,
  DismissibleRoot,
  type DismissibleRootProps,
} from "../private/useDismissible";

const { withContext, withProvider } = createSlotRecipeContext(pageBanner);

export interface PageBannerRootProps extends PageBannerVariantProps, DismissibleRootProps {}

export const PageBannerRoot = withProvider<HTMLDivElement, PageBannerRootProps>(
  DismissibleRoot,
  "root",
);

export interface PageBannerContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const PageBannerContent = withContext<HTMLDivElement, PageBannerContentProps>(
  Primitive.div,
  "content",
);

export interface PageBannerBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PageBannerBody = withContext<HTMLDivElement, PageBannerBodyProps>(
  Primitive.div,
  "body",
);

export interface PageBannerTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const PageBannerTitle = withContext<HTMLSpanElement, PageBannerTitleProps>(
  Primitive.span,
  "title",
);

export interface PageBannerDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const PageBannerDescription = withContext<HTMLSpanElement, PageBannerDescriptionProps>(
  Primitive.span,
  "description",
);

export interface PageBannerButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PageBannerButton = withContext<HTMLButtonElement, PageBannerButtonProps>(
  Primitive.button,
  "button",
);

export interface PageBannerCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PageBannerCloseButton = withContext<HTMLButtonElement, PageBannerCloseButtonProps>(
  DismissibleCloseButton,
  "closeButton",
);
