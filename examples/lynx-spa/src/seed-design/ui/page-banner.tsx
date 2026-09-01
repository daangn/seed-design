import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import * as React from "@lynx-js/react";
import {
  PageBanner as SeedPageBanner,
  PrefixIcon,
  SuffixIcon,
  type PrefixIconProps,
} from "@seed-design/lynx-react";

export interface PageBannerProps
  extends Omit<SeedPageBanner.RootProps, "children" | "open" | "defaultOpen" | "onDismiss"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: React.ReactNode;
  description: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/page-banner
 */
export const PageBanner = React.forwardRef<unknown, PageBannerProps>(
  ({ prefixIcon, title, description, suffix, ...otherProps }, ref) => {
    return (
      <SeedPageBanner.Root ref={ref} {...otherProps}>
        {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedPageBanner.Content>
          <SeedPageBanner.Body>
            {title ? <SeedPageBanner.Title>{title}</SeedPageBanner.Title> : null}
            <SeedPageBanner.Description>{description}</SeedPageBanner.Description>
          </SeedPageBanner.Body>
          {suffix}
        </SeedPageBanner.Content>
      </SeedPageBanner.Root>
    );
  },
);
PageBanner.displayName = "PageBanner";

export interface PageBannerButtonProps extends SeedPageBanner.ButtonProps {}

export const PageBannerButton = SeedPageBanner.Button;

export interface ActionablePageBannerProps
  extends Omit<SeedPageBanner.RootProps, "children" | "open" | "defaultOpen" | "onDismiss"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: React.ReactNode;
  description: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/page-banner
 */
export const ActionablePageBanner = React.forwardRef<unknown, ActionablePageBannerProps>(
  ({ prefixIcon, title, description, ...otherProps }, ref) => {
    return (
      <SeedPageBanner.Root ref={ref} {...otherProps}>
        {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedPageBanner.Content>
          <SeedPageBanner.Body>
            {title ? <SeedPageBanner.Title>{title}</SeedPageBanner.Title> : null}
            <SeedPageBanner.Description>{description}</SeedPageBanner.Description>
          </SeedPageBanner.Body>
        </SeedPageBanner.Content>
        <SuffixIcon icon={<IconChevronRightLine />} />
      </SeedPageBanner.Root>
    );
  },
);
ActionablePageBanner.displayName = "ActionablePageBanner";

export interface DismissiblePageBannerProps extends Omit<SeedPageBanner.RootProps, "children"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: React.ReactNode;
  description: React.ReactNode;
  dismissLabel?: string;
}

/**
 * @see https://seed-design.io/lynx/components/page-banner
 */
export const DismissiblePageBanner = React.forwardRef<unknown, DismissiblePageBannerProps>(
  ({ prefixIcon, title, description, dismissLabel = "닫기", ...otherProps }, ref) => {
    return (
      <SeedPageBanner.Root ref={ref} {...otherProps}>
        {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedPageBanner.Content>
          <SeedPageBanner.Body>
            {title ? <SeedPageBanner.Title>{title}</SeedPageBanner.Title> : null}
            <SeedPageBanner.Description>{description}</SeedPageBanner.Description>
          </SeedPageBanner.Body>
        </SeedPageBanner.Content>
        <SeedPageBanner.CloseButton accessibility-label={dismissLabel}>
          <SuffixIcon icon={<IconXmarkLine />} />
        </SeedPageBanner.CloseButton>
      </SeedPageBanner.Root>
    );
  },
);
DismissiblePageBanner.displayName = "DismissiblePageBanner";
