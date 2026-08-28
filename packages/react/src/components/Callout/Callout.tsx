import type * as React from "react";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { callout, type CalloutVariantProps } from "@seed-design/css/recipes/callout";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withScaleFeedback } from "../../utils/withScaleFeedback";
import {
  DismissibleCloseButton,
  DismissibleRoot,
  type DismissibleRootProps,
} from "../private/useDismissible";

const { withContext, withProvider } = createSlotRecipeContext(callout);

export interface CalloutRootProps extends CalloutVariantProps, DismissibleRootProps {}

// The root only scales when the consumer makes it actionable (`asChild` with a
// button or anchor) — the recipe gates the scale on `:is(button, a)`. Publishing
// the size vars unconditionally costs a plain callout nothing.
export const CalloutRoot = withScaleFeedback(
  withProvider<HTMLDivElement, CalloutRootProps>(DismissibleRoot, "root"),
);

export interface CalloutContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const CalloutContent = withContext<HTMLDivElement, CalloutContentProps>(
  Primitive.div,
  "content",
);

export interface CalloutTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const CalloutTitle = withContext<HTMLSpanElement, CalloutTitleProps>(
  Primitive.span,
  "title",
);

export interface CalloutDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const CalloutDescription = withContext<HTMLSpanElement, CalloutDescriptionProps>(
  Primitive.span,
  "description",
);

export interface CalloutLinkProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CalloutLink = withContext<HTMLButtonElement, CalloutLinkProps>(
  Primitive.button,
  "link",
);

export interface CalloutCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CalloutCloseButton = withScaleFeedback(
  withContext<HTMLButtonElement, CalloutCloseButtonProps>(DismissibleCloseButton, "closeButton"),
);
