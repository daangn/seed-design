"use client";

import {
  PrefixIcon,
  Callout as SeedCallout,
  SuffixIcon,
} from "@seed-design/react";
import * as React from "react";

import {
  IconChevronRightLine,
  IconXmarkLine,
} from "@karrotmarket/react-monochrome-icon"; // "@daangn/react-monochrome-icon"과 동일합니다.

export interface CalloutProps
  extends Omit<
    SeedCallout.RootProps,
    "children" | "title" | "asChild" | "open" | "defaultOpen" | "onDismiss"
  > {
  prefixIcon?: React.ReactNode;

  title?: React.ReactNode;

  description: React.ReactNode;

  linkProps?: SeedCallout.LinkProps;
}

/**
 * @see https://seed-design.io/react/components/callout
 */
export const Callout = React.forwardRef<
  React.ElementRef<typeof SeedCallout.Root>,
  CalloutProps
>(({ prefixIcon, title, description, linkProps, ...otherProps }, ref) => {
  return (
    <SeedCallout.Root ref={ref} {...otherProps}>
      {prefixIcon && <PrefixIcon svg={prefixIcon} />}
      <SeedCallout.Content>
        {title && <SeedCallout.Title>{title}</SeedCallout.Title>}
        <SeedCallout.Description>{description}</SeedCallout.Description>
        {linkProps && <SeedCallout.Link {...linkProps} />}
      </SeedCallout.Content>
    </SeedCallout.Root>
  );
});
Callout.displayName = "Callout";

export interface ActionableCalloutProps
  extends Omit<
    SeedCallout.RootProps,
    "children" | "title" | "asChild" | "open" | "defaultOpen" | "onDismiss"
  > {
  title?: React.ReactNode;

  description: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/callout
 */
export const ActionableCallout = React.forwardRef<
  React.ElementRef<typeof SeedCallout.Root>,
  ActionableCalloutProps
>(({ title, description, ...otherProps }, ref) => {
  return (
    <SeedCallout.Root ref={ref} {...otherProps} asChild>
      <button type="button">
        <SeedCallout.Content>
          {title && <SeedCallout.Title>{title}</SeedCallout.Title>}
          <SeedCallout.Description>{description}</SeedCallout.Description>
        </SeedCallout.Content>
        <SuffixIcon svg={<IconChevronRightLine />} />
      </button>
    </SeedCallout.Root>
  );
});
ActionableCallout.displayName = "ActionableCallout";

export interface DismissibleCalloutProps
  extends Omit<SeedCallout.RootProps, "children" | "title" | "asChild"> {
  title?: React.ReactNode;

  description: React.ReactNode;

  linkProps?: SeedCallout.LinkProps;
}

/**
 * @see https://seed-design.io/react/components/callout
 */
export const DismissibleCallout = React.forwardRef<
  React.ElementRef<typeof SeedCallout.Root>,
  DismissibleCalloutProps
>(
  (
    {
      title,
      description,
      linkProps,
      defaultOpen,
      open,
      onDismiss,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <SeedCallout.Root ref={ref} {...otherProps}>
        <SeedCallout.Content>
          {title && <SeedCallout.Title>{title}</SeedCallout.Title>}
          <SeedCallout.Description>{description}</SeedCallout.Description>
          {linkProps && <SeedCallout.Link {...linkProps} />}
        </SeedCallout.Content>
        {/* You may implement your own i18n for dismiss label */}
        <SeedCallout.CloseButton aria-label="닫기">
          <SuffixIcon svg={<IconXmarkLine />} />
        </SeedCallout.CloseButton>
      </SeedCallout.Root>
    );
  },
);
DismissibleCallout.displayName = "DismissibleCallout";
