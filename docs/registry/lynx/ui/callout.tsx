import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import * as React from "@lynx-js/react";
import {
  Callout as SeedCallout,
  PrefixIcon,
  SuffixIcon,
  type PrefixIconProps,
} from "@seed-design/lynx-react";

export interface CalloutProps
  extends Omit<SeedCallout.RootProps, "children" | "open" | "defaultOpen" | "onDismiss"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: React.ReactNode;
  description: React.ReactNode;
  linkProps?: SeedCallout.LinkProps;
}

/**
 * @see https://seed-design.io/lynx/components/callout
 */
export const Callout = React.forwardRef<unknown, CalloutProps>(
  ({ prefixIcon, title, description, linkProps, ...otherProps }, ref) => {
    return (
      <SeedCallout.Root ref={ref} {...otherProps}>
        {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedCallout.Content>
          {title ? <SeedCallout.Title>{title}</SeedCallout.Title> : null}
          <SeedCallout.Description>{description}</SeedCallout.Description>
          {linkProps ? <SeedCallout.Link {...linkProps} /> : null}
        </SeedCallout.Content>
      </SeedCallout.Root>
    );
  },
);
Callout.displayName = "Callout";

export interface ActionableCalloutProps
  extends Omit<SeedCallout.RootProps, "children" | "open" | "defaultOpen" | "onDismiss"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: React.ReactNode;
  description: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/callout
 */
export const ActionableCallout = React.forwardRef<unknown, ActionableCalloutProps>(
  ({ prefixIcon, title, description, ...otherProps }, ref) => {
    return (
      <SeedCallout.Root ref={ref} {...otherProps}>
        {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedCallout.Content>
          {title ? <SeedCallout.Title>{title}</SeedCallout.Title> : null}
          <SeedCallout.Description>{description}</SeedCallout.Description>
        </SeedCallout.Content>
        <SuffixIcon icon={<IconChevronRightLine />} />
      </SeedCallout.Root>
    );
  },
);
ActionableCallout.displayName = "ActionableCallout";

export interface DismissibleCalloutProps extends Omit<SeedCallout.RootProps, "children"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: React.ReactNode;
  description: React.ReactNode;
  linkProps?: SeedCallout.LinkProps;
  dismissLabel?: string;
}

/**
 * @see https://seed-design.io/lynx/components/callout
 */
export const DismissibleCallout = React.forwardRef<unknown, DismissibleCalloutProps>(
  ({ prefixIcon, title, description, linkProps, dismissLabel = "닫기", ...otherProps }, ref) => {
    return (
      <SeedCallout.Root ref={ref} {...otherProps}>
        {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedCallout.Content>
          {title ? <SeedCallout.Title>{title}</SeedCallout.Title> : null}
          <SeedCallout.Description>{description}</SeedCallout.Description>
          {linkProps ? <SeedCallout.Link {...linkProps} /> : null}
        </SeedCallout.Content>
        <SeedCallout.CloseButton accessibility-label={dismissLabel}>
          <SuffixIcon icon={<IconXmarkLine />} />
        </SeedCallout.CloseButton>
      </SeedCallout.Root>
    );
  },
);
DismissibleCallout.displayName = "DismissibleCallout";
