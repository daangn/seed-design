import * as React from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFatFill";
import {
  Checkbox as SeedCheckbox,
  Divider as SeedDivider,
  type DividerProps as SeedDividerProps,
  List as SeedList,
  RadioGroup as SeedRadioGroup,
  Switch as SeedSwitch,
} from "@seed-design/lynx-react";

export interface ListProps extends SeedList.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const List = SeedList.Root;

interface ListItemContentProps {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

function ListItemContent({ title, detail, prefix, suffix }: ListItemContentProps) {
  return (
    <>
      {prefix != null ? <SeedList.Prefix>{prefix}</SeedList.Prefix> : null}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail != null ? <SeedList.Detail>{detail}</SeedList.Detail> : null}
      </SeedList.Content>
      {suffix != null ? <SeedList.Suffix>{suffix}</SeedList.Suffix> : null}
    </>
  );
}

function inferAccessibilityLabel(title: React.ReactNode) {
  return typeof title === "string" ? title : undefined;
}

export interface ListItemProps extends Omit<SeedList.ItemProps, "children">, ListItemContentProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const ListItem = React.forwardRef<unknown, ListItemProps>(
  ({ title, detail, prefix, suffix, ...props }, ref) => {
    return (
      <SeedList.Item ref={ref} {...props}>
        <ListItemContent title={title} detail={detail} prefix={prefix} suffix={suffix} />
      </SeedList.Item>
    );
  },
);
ListItem.displayName = "ListItem";

export interface ListButtonItemProps
  extends Omit<SeedList.ButtonItemProps, "children">,
    ListItemContentProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const ListButtonItem = React.forwardRef<unknown, ListButtonItemProps>(
  ({ title, detail, prefix, suffix, "accessibility-label": accessibilityLabel, ...props }, ref) => {
    return (
      <SeedList.ButtonItem
        ref={ref}
        accessibility-label={accessibilityLabel ?? inferAccessibilityLabel(title)}
        {...props}
      >
        <ListItemContent title={title} detail={detail} prefix={prefix} suffix={suffix} />
      </SeedList.ButtonItem>
    );
  },
);
ListButtonItem.displayName = "ListButtonItem";

export interface ListCheckItemProps
  extends Omit<SeedList.CheckboxItemProps, "children">,
    ListItemContentProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const ListCheckItem = React.forwardRef<unknown, ListCheckItemProps>(
  ({ title, detail, prefix, suffix, "accessibility-label": accessibilityLabel, ...props }, ref) => {
    const defaultSuffix = (
      <SeedCheckbox.Control>
        <SeedCheckbox.Indicator
          checked={<IconCheckmarkFatFill />}
          indeterminate={<IconMinusFatFill />}
        />
      </SeedCheckbox.Control>
    );

    return (
      <SeedList.CheckboxItem
        ref={ref}
        accessibility-label={accessibilityLabel ?? inferAccessibilityLabel(title)}
        {...props}
      >
        <ListItemContent
          title={title}
          detail={detail}
          prefix={prefix}
          suffix={suffix === undefined ? defaultSuffix : suffix}
        />
      </SeedList.CheckboxItem>
    );
  },
);
ListCheckItem.displayName = "ListCheckItem";

export interface ListRadioItemProps
  extends Omit<SeedList.RadioItemProps, "children">,
    ListItemContentProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const ListRadioItem = React.forwardRef<unknown, ListRadioItemProps>(
  ({ title, detail, prefix, suffix, "accessibility-label": accessibilityLabel, ...props }, ref) => {
    const defaultSuffix = (
      <SeedRadioGroup.ItemControl>
        <SeedRadioGroup.ItemIndicator />
      </SeedRadioGroup.ItemControl>
    );

    return (
      <SeedList.RadioItem
        ref={ref}
        accessibility-label={accessibilityLabel ?? inferAccessibilityLabel(title)}
        {...props}
      >
        <ListItemContent
          title={title}
          detail={detail}
          prefix={prefix}
          suffix={suffix === undefined ? defaultSuffix : suffix}
        />
      </SeedList.RadioItem>
    );
  },
);
ListRadioItem.displayName = "ListRadioItem";

export interface ListSwitchItemProps
  extends Omit<SeedList.SwitchItemProps, "children">,
    ListItemContentProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const ListSwitchItem = React.forwardRef<unknown, ListSwitchItemProps>(
  ({ title, detail, prefix, suffix, "accessibility-label": accessibilityLabel, ...props }, ref) => {
    const defaultSuffix = (
      <SeedSwitch.Control>
        <SeedSwitch.Thumb />
      </SeedSwitch.Control>
    );

    return (
      <SeedList.SwitchItem
        ref={ref}
        accessibility-label={accessibilityLabel ?? inferAccessibilityLabel(title)}
        {...props}
      >
        <ListItemContent
          title={title}
          detail={detail}
          prefix={prefix}
          suffix={suffix === undefined ? defaultSuffix : suffix}
        />
      </SeedList.SwitchItem>
    );
  },
);
ListSwitchItem.displayName = "ListSwitchItem";

export interface ListDividerProps extends SeedDividerProps {}

/**
 * @see https://seed-design.io/lynx/components/list
 */
export const ListDivider = React.forwardRef<unknown, ListDividerProps>((props, ref) => {
  return <SeedDivider ref={ref} accessibility-element={false} {...props} />;
});
ListDivider.displayName = "ListDivider";
