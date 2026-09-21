import IconILowercaseSerifCircleLine from "@karrotmarket/lynx-monochrome-icon/IconILowercaseSerifCircleLine";
import * as React from "@lynx-js/react";
import { Badge as SeedBadge, Icon, type IconProps } from "@seed-design/lynx-react";

export interface BadgeActionProps
  extends Omit<SeedBadge.ActionProps, "accessibility-label" | "children"> {
  "accessibility-label": string;
  render?: (triggerElement: React.ReactElement) => React.ReactNode;
}

export type BadgeProps = Omit<SeedBadge.RootProps, "children" | "prefix" | "action"> & {
  children: React.ReactNode;
  prefix?: IconProps["icon"];
  actionProps?: BadgeActionProps;
};

export const Badge = React.forwardRef<unknown, BadgeProps>((props, ref) => {
  const { prefix, actionProps, children, ...rootProps } = props;
  let actionElement: React.ReactNode = null;

  if (actionProps) {
    const { render, ...seedActionProps } = actionProps;
    const triggerElement = (
      <SeedBadge.Action {...seedActionProps}>
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
