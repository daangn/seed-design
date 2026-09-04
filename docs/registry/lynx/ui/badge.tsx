import IconILowercaseSerifCircleLine from "@karrotmarket/lynx-monochrome-icon/IconILowercaseSerifCircleLine";
import * as React from "@lynx-js/react";
import { Badge as SeedBadge, Icon, type IconProps } from "@seed-design/lynx-react";

export interface BadgeActionOptions
  extends Omit<SeedBadge.ActionProps, "accessibility-label" | "children"> {
  "accessibility-label": string;
  render?: (triggerElement: React.ReactElement) => React.ReactNode;
}

type BadgeBaseProps = Omit<SeedBadge.RootProps, "children" | "prefix" | "action"> & {
  children: React.ReactNode;
};

type BadgePrefixProps = {
  prefix?: IconProps["icon"];
  action?: never;
};

type BadgeActionProps = {
  prefix?: never;
  action?: BadgeActionOptions;
};

export type BadgeProps = BadgeBaseProps & (BadgePrefixProps | BadgeActionProps);

export const Badge = React.forwardRef<unknown, BadgeProps>((props, ref) => {
  const { prefix, action, children, ...rootProps } = props;
  let actionElement: React.ReactNode = null;

  if (action) {
    const { render, ...actionProps } = action;
    const triggerElement = (
      <SeedBadge.Action {...actionProps}>
        <Icon icon={<IconILowercaseSerifCircleLine />} size="full" />
      </SeedBadge.Action>
    );

    actionElement = render ? render(triggerElement) : triggerElement;
  }

  return (
    <SeedBadge.Root ref={ref} {...rootProps}>
      {prefix ? (
        <SeedBadge.Prefix>
          <Icon icon={prefix} size="full" />
        </SeedBadge.Prefix>
      ) : null}
      <SeedBadge.Label>{children}</SeedBadge.Label>
      {actionElement}
    </SeedBadge.Root>
  );
});
Badge.displayName = "Badge";
