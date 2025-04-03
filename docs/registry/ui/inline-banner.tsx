"use client";

import {
  PrefixIcon,
  InlineBanner as SeedInlineBanner,
  SuffixIcon,
} from "@seed-design/react";
import * as React from "react";

import {
  IconChevronRightLine,
  IconXmarkLine,
} from "@karrotmarket/react-monochrome-icon";

export interface InlineBannerProps
  extends Omit<
    SeedInlineBanner.RootProps,
    "children" | "title" | "asChild" | "open" | "defaultOpen" | "onDismiss"
  > {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;

  linkProps?: SeedInlineBanner.LinkProps;
}

/**
 * @see https://seed-design.io/react/components/inline-banner
 */
export const InlineBanner = React.forwardRef<
  React.ElementRef<typeof SeedInlineBanner.Root>,
  InlineBannerProps
>(({ prefixIcon, title, description, linkProps, ...otherProps }, ref) => {
  return (
    <SeedInlineBanner.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedInlineBanner.Content>
        {title && <SeedInlineBanner.Title>{title}</SeedInlineBanner.Title>}
        <SeedInlineBanner.Description>
          {description}
        </SeedInlineBanner.Description>
      </SeedInlineBanner.Content>
      {linkProps && <SeedInlineBanner.Link {...linkProps} />}
    </SeedInlineBanner.Root>
  );
});
InlineBanner.displayName = "InlineBanner";

export interface ActionableInlineBannerProps
  extends Omit<
    SeedInlineBanner.RootProps,
    "children" | "title" | "asChild" | "open" | "defaultOpen" | "onDismiss"
  > {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/inline-banner
 */
export const ActionableInlineBanner = React.forwardRef<
  React.ElementRef<typeof SeedInlineBanner.Root>,
  ActionableInlineBannerProps
>(({ prefixIcon, title, description, ...otherProps }, ref) => {
  return (
    <SeedInlineBanner.Root ref={ref} {...otherProps} asChild>
      <button type="button">
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedInlineBanner.Content>
          {title && <SeedInlineBanner.Title>{title}</SeedInlineBanner.Title>}
          <SeedInlineBanner.Description>
            {description}
          </SeedInlineBanner.Description>
        </SeedInlineBanner.Content>
        <SuffixIcon svg={<IconChevronRightLine />} />
      </button>
    </SeedInlineBanner.Root>
  );
});
ActionableInlineBanner.displayName = "ActionableInlineBanner";

export interface DismissibleInlineBannerProps
  extends Omit<
    SeedInlineBanner.RootProps,
    "variant" | "children" | "title" | "asChild"
  > {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;

  // While critical variants are discouraged in dismissible, you may remove the restriction if needed.
  variant?: Exclude<
    SeedInlineBanner.RootProps["variant"],
    "criticalWeak" | "criticalSolid"
  >;
}

/**
 * @see https://seed-design.io/react/components/inline-banner
 */
export const DismissibleInlineBanner = React.forwardRef<
  React.ElementRef<typeof SeedInlineBanner.Root>,
  DismissibleInlineBannerProps
>(({ prefixIcon, title, description, ...otherProps }, ref) => {
  return (
    <SeedInlineBanner.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedInlineBanner.Content>
        {title && <SeedInlineBanner.Title>{title}</SeedInlineBanner.Title>}
        <SeedInlineBanner.Description>
          {description}
        </SeedInlineBanner.Description>
      </SeedInlineBanner.Content>
      {/* You may implement your own i18n for dismiss label */}
      <SeedInlineBanner.CloseButton aria-label="닫기">
        <SuffixIcon svg={<IconXmarkLine />} />
      </SeedInlineBanner.CloseButton>
    </SeedInlineBanner.Root>
  );
});
DismissibleInlineBanner.displayName = "DismissibleInlineBanner";
