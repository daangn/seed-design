import IconChevronRightLine from "@karrotmarket/lynx-monochrome-icon/IconChevronRightLine";
import IconXmarkLine from "@karrotmarket/lynx-monochrome-icon/IconXmarkLine";
import { forwardRef, type ReactNode } from "@lynx-js/react";
import {
  Callout as SeedCallout,
  PrefixIcon,
  SuffixIcon,
  type PrefixIconProps,
} from "@seed-design/lynx-react";

export interface CalloutProps extends Omit<SeedCallout.RootProps, "children"> {
  prefixIcon?: PrefixIconProps["icon"];
  title?: ReactNode;
  description: ReactNode;
}

/** @see https://seed-design.io/lynx/components/callout */
export const Callout = forwardRef<unknown, CalloutProps>(
  ({ prefixIcon, title, description, ...rootProps }, ref) => (
    <SeedCallout.Root ref={ref} {...rootProps}>
      {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
      <SeedCallout.Content>
        {title ? <SeedCallout.Title>{title}</SeedCallout.Title> : null}
        <SeedCallout.Description>{description}</SeedCallout.Description>
      </SeedCallout.Content>
    </SeedCallout.Root>
  ),
);
Callout.displayName = "Callout";

export interface ActionableCalloutProps extends Omit<CalloutProps, "bindtap"> {
  bindtap: NonNullable<CalloutProps["bindtap"]>;
}

export const ActionableCallout = forwardRef<unknown, ActionableCalloutProps>(
  ({ prefixIcon, title, description, bindtap, ...rootProps }, ref) => (
    <SeedCallout.Root ref={ref} {...rootProps} bindtap={bindtap}>
      {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
      <SeedCallout.Content>
        {title ? <SeedCallout.Title>{title}</SeedCallout.Title> : null}
        <SeedCallout.Description>{description}</SeedCallout.Description>
      </SeedCallout.Content>
      <SuffixIcon icon={<IconChevronRightLine />} />
    </SeedCallout.Root>
  ),
);
ActionableCallout.displayName = "ActionableCallout";

export interface DismissibleCalloutProps extends CalloutProps {
  onDismiss?: () => void;
}

export const DismissibleCallout = forwardRef<unknown, DismissibleCalloutProps>(
  ({ prefixIcon, title, description, ...rootProps }, ref) => (
    <SeedCallout.Root ref={ref} {...rootProps}>
      {prefixIcon ? <PrefixIcon icon={prefixIcon} /> : null}
      <SeedCallout.Content>
        {title ? <SeedCallout.Title>{title}</SeedCallout.Title> : null}
        <SeedCallout.Description>{description}</SeedCallout.Description>
      </SeedCallout.Content>
      <SeedCallout.CloseButton accessibility-label="닫기">
        <SuffixIcon icon={<IconXmarkLine />} />
      </SeedCallout.CloseButton>
    </SeedCallout.Root>
  ),
);
DismissibleCallout.displayName = "DismissibleCallout";
