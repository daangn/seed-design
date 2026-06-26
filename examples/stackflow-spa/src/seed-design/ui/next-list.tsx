import {
  NextList as SeedNextList,
  Divider as SeedDivider,
  type DividerProps as SeedDividerProps,
} from "@seed-design/react";
import * as React from "react";

export interface NextListProps extends SeedNextList.RootProps {}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextList = SeedNextList.Root;

export interface NextListItemProps
  extends Omit<SeedNextList.ItemProps, "title" | "prefix" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListItem = React.forwardRef<HTMLLIElement, NextListItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedNextList.Item ref={ref} {...otherProps}>
        {prefix && <SeedNextList.Prefix>{prefix}</SeedNextList.Prefix>}
        <SeedNextList.Content>
          <SeedNextList.Title>{title}</SeedNextList.Title>
          {detail && <SeedNextList.Detail>{detail}</SeedNextList.Detail>}
        </SeedNextList.Content>
        {suffix && <SeedNextList.Suffix>{suffix}</SeedNextList.Suffix>}
      </SeedNextList.Item>
    );
  },
);
NextListItem.displayName = "NextListItem";

export interface NextListButtonItemProps
  extends Omit<SeedNextList.ButtonItemProps, "title" | "prefix" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListButtonItem = React.forwardRef<HTMLButtonElement, NextListButtonItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedNextList.ButtonItem ref={ref} {...otherProps}>
        {prefix && <SeedNextList.Prefix>{prefix}</SeedNextList.Prefix>}
        <SeedNextList.Content>
          <SeedNextList.Title>{title}</SeedNextList.Title>
          {detail && <SeedNextList.Detail>{detail}</SeedNextList.Detail>}
        </SeedNextList.Content>
        {suffix && <SeedNextList.Suffix>{suffix}</SeedNextList.Suffix>}
      </SeedNextList.ButtonItem>
    );
  },
);
NextListButtonItem.displayName = "NextListButtonItem";

export interface NextListLinkItemProps
  extends Omit<SeedNextList.AnchorItemProps, "title" | "prefix" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListLinkItem = React.forwardRef<HTMLAnchorElement, NextListLinkItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedNextList.AnchorItem ref={ref} {...otherProps}>
        {prefix && <SeedNextList.Prefix>{prefix}</SeedNextList.Prefix>}
        <SeedNextList.Content>
          <SeedNextList.Title>{title}</SeedNextList.Title>
          {detail && <SeedNextList.Detail>{detail}</SeedNextList.Detail>}
        </SeedNextList.Content>
        {suffix && <SeedNextList.Suffix>{suffix}</SeedNextList.Suffix>}
      </SeedNextList.AnchorItem>
    );
  },
);
NextListLinkItem.displayName = "NextListLinkItem";

export interface NextListCheckItemProps
  extends Omit<SeedNextList.CheckboxItemProps, "title" | "prefix" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListCheckItem = React.forwardRef<HTMLInputElement, NextListCheckItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedNextList.CheckboxItem ref={ref} {...otherProps}>
        {prefix && <SeedNextList.Prefix>{prefix}</SeedNextList.Prefix>}
        <SeedNextList.Content>
          <SeedNextList.Title>{title}</SeedNextList.Title>
          {detail && <SeedNextList.Detail>{detail}</SeedNextList.Detail>}
        </SeedNextList.Content>
        {suffix && <SeedNextList.Suffix>{suffix}</SeedNextList.Suffix>}
      </SeedNextList.CheckboxItem>
    );
  },
);
NextListCheckItem.displayName = "NextListCheckItem";

export interface NextListRadioItemProps
  extends Omit<SeedNextList.RadioItemProps, "title" | "prefix" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListRadioItem = React.forwardRef<HTMLInputElement, NextListRadioItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedNextList.RadioItem ref={ref} {...otherProps}>
        {prefix && <SeedNextList.Prefix>{prefix}</SeedNextList.Prefix>}
        <SeedNextList.Content>
          <SeedNextList.Title>{title}</SeedNextList.Title>
          {detail && <SeedNextList.Detail>{detail}</SeedNextList.Detail>}
        </SeedNextList.Content>
        {suffix && <SeedNextList.Suffix>{suffix}</SeedNextList.Suffix>}
      </SeedNextList.RadioItem>
    );
  },
);
NextListRadioItem.displayName = "NextListRadioItem";

export interface NextListSwitchItemProps
  extends Omit<SeedNextList.SwitchItemProps, "title" | "prefix" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListSwitchItem = React.forwardRef<HTMLInputElement, NextListSwitchItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedNextList.SwitchItem ref={ref} {...otherProps}>
        {prefix && <SeedNextList.Prefix>{prefix}</SeedNextList.Prefix>}
        <SeedNextList.Content>
          <SeedNextList.Title>{title}</SeedNextList.Title>
          {detail && <SeedNextList.Detail>{detail}</SeedNextList.Detail>}
        </SeedNextList.Content>
        {suffix && <SeedNextList.Suffix>{suffix}</SeedNextList.Suffix>}
      </SeedNextList.SwitchItem>
    );
  },
);
NextListSwitchItem.displayName = "NextListSwitchItem";

export interface NextListDividerProps extends SeedDividerProps {
  /**
   * @default "li"
   */
  as?: SeedDividerProps["as"];

  /**
   * @default true
   */
  "aria-hidden"?: SeedDividerProps["aria-hidden"];
}

/**
 * @see https://seed-design.io/react/components/next-list
 */
export const NextListDivider = React.forwardRef<HTMLLIElement, NextListDividerProps>(
  ({ as = "li", "aria-hidden": ariaHidden = true, ...props }, ref) => {
    return (
      <SeedDivider
        as={as}
        aria-hidden={ariaHidden}
        ref={ref as React.ForwardedRef<HTMLHRElement>}
        {...props}
      />
    );
  },
);
NextListDivider.displayName = "NextListDivider";
