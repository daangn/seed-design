"use client";

import { PrefixIcon, PageBanner as SeedPageBanner, SuffixIcon } from "@seed-design/react";
import * as React from "react";

import { IconChevronRightLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon"; // "@daangn/react-monochrome-icon"과 동일합니다.

export interface PageBannerProps
  extends Omit<
    SeedPageBanner.RootProps,
    "children" | "title" | "asChild" | "open" | "defaultOpen" | "onDismiss"
  > {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;

  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/page-banner
 */
export const PageBanner = React.forwardRef<
  React.ElementRef<typeof SeedPageBanner.Root>,
  PageBannerProps
>(({ prefixIcon, title, description, suffix, ...otherProps }, ref) => {
  return (
    <SeedPageBanner.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedPageBanner.Content>
        <SeedPageBanner.Body>
          {title && <SeedPageBanner.Title>{title}</SeedPageBanner.Title>}
          <SeedPageBanner.Description>{description}</SeedPageBanner.Description>
        </SeedPageBanner.Body>
        {suffix}
      </SeedPageBanner.Content>
    </SeedPageBanner.Root>
  );
});
PageBanner.displayName = "PageBanner";

export interface PageBannerButtonProps extends SeedPageBanner.ButtonProps {}

export const PageBannerButton = SeedPageBanner.Button;

export interface ActionablePageBannerProps
  extends Omit<
    SeedPageBanner.RootProps,
    "children" | "title" | "asChild" | "open" | "defaultOpen" | "onDismiss"
  > {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/page-banner
 */
export const ActionablePageBanner = React.forwardRef<
  React.ElementRef<typeof SeedPageBanner.Root>,
  ActionablePageBannerProps
>(({ prefixIcon, title, description, ...otherProps }, ref) => {
  return (
    <SeedPageBanner.Root ref={ref} {...otherProps} asChild>
      <button type="button">
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedPageBanner.Content>
          <SeedPageBanner.Body>
            {title && <SeedPageBanner.Title>{title}</SeedPageBanner.Title>}
            <SeedPageBanner.Description>{description}</SeedPageBanner.Description>
          </SeedPageBanner.Body>
        </SeedPageBanner.Content>
        <SuffixIcon svg={<IconChevronRightLine />} />
      </button>
    </SeedPageBanner.Root>
  );
});
ActionablePageBanner.displayName = "ActionablePageBanner";

export interface DismissiblePageBannerProps
  extends Omit<SeedPageBanner.RootProps, "children" | "title" | "asChild"> {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/page-banner
 */
export const DismissiblePageBanner = React.forwardRef<
  React.ElementRef<typeof SeedPageBanner.Root>,
  DismissiblePageBannerProps
>(({ prefixIcon, title, description, ...otherProps }, ref) => {
  return (
    <SeedPageBanner.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedPageBanner.Content>
        <SeedPageBanner.Body>
          {title && <SeedPageBanner.Title>{title}</SeedPageBanner.Title>}
          <SeedPageBanner.Description>{description}</SeedPageBanner.Description>
        </SeedPageBanner.Body>
      </SeedPageBanner.Content>
      {/* You may implement your own i18n for dismiss label */}
      <SeedPageBanner.CloseButton aria-label="닫기">
        <SuffixIcon svg={<IconXmarkLine />} />
      </SeedPageBanner.CloseButton>
    </SeedPageBanner.Root>
  );
});
DismissiblePageBanner.displayName = "DismissiblePageBanner";
