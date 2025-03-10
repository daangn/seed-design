import type * as React from "react";

import {
  inlineBanner,
  type InlineBannerVariantProps,
} from "@seed-design/css/recipes/inline-banner";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import {
  DismissibleCloseButton,
  DismissibleRoot,
  type DismissibleRootProps,
} from "../private/useDismissible";

const { withContext, withProvider } = createSlotRecipeContext(inlineBanner);

export interface InlineBannerRootProps extends InlineBannerVariantProps, DismissibleRootProps {}

export const InlineBannerRoot = withProvider<HTMLDivElement, InlineBannerRootProps>(
  DismissibleRoot,
  "root",
);

export interface InlineBannerContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const InlineBannerContent = withContext<HTMLDivElement, InlineBannerContentProps>(
  Primitive.div,
  "content",
);

export interface InlineBannerTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const InlineBannerTitle = withContext<HTMLSpanElement, InlineBannerTitleProps>(
  Primitive.span,
  "title",
);

export interface InlineBannerDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const InlineBannerDescription = withContext<HTMLSpanElement, InlineBannerDescriptionProps>(
  Primitive.span,
  "description",
);

export interface InlineBannerLinkProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InlineBannerLink = withContext<HTMLButtonElement, InlineBannerLinkProps>(
  Primitive.button,
  "link",
);

export interface InlineBannerCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InlineBannerCloseButton = withContext<HTMLButtonElement, InlineBannerCloseButtonProps>(
  DismissibleCloseButton,
  "closeButton",
);
