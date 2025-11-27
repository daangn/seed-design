import type * as React from "react";
import { forwardRef } from "react";

import { pageBanner, type PageBannerVariantProps } from "@seed-design/css/recipes/page-banner";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import {
  DismissibleCloseButton,
  DismissibleRoot,
  type DismissibleRootProps,
} from "../private/useDismissible";
import clsx from "clsx";

const { withContext, ClassNamesProvider } = createSlotRecipeContext(pageBanner);

export interface PageBannerRootProps extends PageBannerVariantProps, DismissibleRootProps {}

export const PageBannerRoot = forwardRef<HTMLDivElement, PageBannerRootProps>(
  ({ className, ...props }, ref) => {
    if (props.variant === "solid" && props.tone === "magic") {
      console.error(
        `\`${props.tone}\` tone is not available for \`${props.variant}\` variant in PageBanner components. Please use variant="weak" a different tone instead.`,
      );
    }

    const [variantProps, otherProps] = pageBanner.splitVariantProps(props);
    const classNames = pageBanner(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <DismissibleRoot className={clsx(classNames.root, className)} ref={ref} {...otherProps} />
      </ClassNamesProvider>
    );
  },
);

// Use these instead when the following ts implements this:
// Control flow analysis for destructured rest element of discriminated union
// https://github.com/microsoft/TypeScript/issues/15300

// export type PageBannerRootProps = DismissibleRootProps &
//   (
//     | {
//         variant?: Exclude<PageBannerVariantProps["variant"], "solid">;
//         tone?: PageBannerVariantProps["tone"];
//       }
//     | {
//         variant: Extract<PageBannerVariantProps["variant"], "solid">;
//         tone?: Exclude<PageBannerVariantProps["tone"], "magic">;
//       }
//   );

// export const PageBannerRoot = withProvider<HTMLDivElement, PageBannerRootProps>(
//   DismissibleRoot,
//   "root",
// );

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
