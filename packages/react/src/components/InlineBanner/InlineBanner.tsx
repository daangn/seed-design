'use client';
import type * as React from "react";

import {
  inlineBanner,
  type InlineBannerVariantProps,
} from "@ride-developer/css/recipes/inline-banner";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import {
  DismissibleCloseButton,
  DismissibleRoot,
  type DismissibleRootProps,
} from "../private/useDismissible";

const { withContext, withProvider } = createSlotRecipeContext(inlineBanner);

/**
 * @deprecated Use `PageBanner` instead.
 */
export interface InlineBannerRootProps extends InlineBannerVariantProps, DismissibleRootProps {}

/**
 * @deprecated Use `PageBanner` instead.
 */
export const InlineBannerRoot = withProvider<HTMLDivElement, InlineBannerRootProps>(
  DismissibleRoot,
  "root",
);

/**
 * @deprecated Use `PageBanner` instead.
 */
export interface InlineBannerContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Use `PageBanner` instead.
 */
export const InlineBannerContent = withContext<HTMLDivElement, InlineBannerContentProps>(
  Primitive.div,
  "content",
);

/**
 * @deprecated Use `PageBanner` instead.
 */
export interface InlineBannerTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * @deprecated Use `PageBanner` instead.
 */
export const InlineBannerTitle = withContext<HTMLSpanElement, InlineBannerTitleProps>(
  Primitive.span,
  "title",
);

/**
 * @deprecated Use `PageBanner` instead.
 */
export interface InlineBannerDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

/**
 * @deprecated Use `PageBanner` instead.
 */
export const InlineBannerDescription = withContext<HTMLSpanElement, InlineBannerDescriptionProps>(
  Primitive.span,
  "description",
);

/**
 * @deprecated Use `PageBanner` instead.
 */
export interface InlineBannerLinkProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated Use `PageBanner` instead.
 */
export const InlineBannerLink = withContext<HTMLButtonElement, InlineBannerLinkProps>(
  Primitive.button,
  "link",
);

/**
 * @deprecated Use `PageBanner` instead.
 */
export interface InlineBannerCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * @deprecated Use `PageBanner` instead.
 */
export const InlineBannerCloseButton = withContext<HTMLButtonElement, InlineBannerCloseButtonProps>(
  DismissibleCloseButton,
  "closeButton",
);
