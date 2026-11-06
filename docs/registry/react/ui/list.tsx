"use client";

import {
  List as SeedList,
  Checkbox,
  RadioGroup,
  Switch,
  Divider as SeedDivider,
  type DividerProps as SeedDividerProps,
} from "@seed-design/react";
import { listItem } from "@seed-design/css/recipes/list-item";
import * as React from "react";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListProps` instead.
 */
export interface ListProps extends SeedList.RootProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextList` instead.
 * @see https://seed-design.io/react/components/list
 */
export const List = SeedList.Root;

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListItemProps` instead.
 */
export interface ListItemProps
  extends Omit<SeedList.ItemProps, "title" | "prefix" | "asChild" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListItem` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedList.Item ref={ref} {...otherProps}>
        {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
        <SeedList.Content>
          <SeedList.Title>{title}</SeedList.Title>
          {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
        </SeedList.Content>
        {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListItem.displayName = "ListItem";

type ListItemBaseProps = Omit<SeedList.ItemProps, keyof React.HTMLAttributes<HTMLLIElement>>;

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListButtonItemProps` instead.
 */
export interface ListButtonItemProps
  extends Omit<
    ListItemBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
    "title" | "prefix" | "asChild" | "children"
  > {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  rootRef?: React.Ref<HTMLLIElement>;
  rootProps?: React.HTMLAttributes<HTMLLIElement>;
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListButtonItem` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListButtonItem = React.forwardRef<HTMLButtonElement, ListButtonItemProps>(
  ({ title, detail, prefix, suffix, alignItems, rootRef, rootProps, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    const stateProps = React.useMemo(
      () => ({ "data-disabled": otherProps.disabled ? "" : undefined }),
      [otherProps.disabled],
    );

    return (
      <SeedList.Item ref={rootRef} alignItems={alignItems} {...variantProps} {...rootProps}>
        {prefix && <SeedList.Prefix {...stateProps}>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <button type="button" ref={ref} {...otherProps}>
            <SeedList.Title {...stateProps}>{title}</SeedList.Title>
            {detail && <SeedList.Detail {...stateProps}>{detail}</SeedList.Detail>}
          </button>
        </SeedList.Content>
        {suffix && <SeedList.Suffix {...stateProps}>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListButtonItem.displayName = "ListButtonItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListLinkItemProps` instead.
 */
export interface ListLinkItemProps
  extends Omit<
    ListItemBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "title" | "prefix" | "asChild" | "children"
  > {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  rootRef?: React.Ref<HTMLLIElement>;
  rootProps?: React.HTMLAttributes<HTMLLIElement>;
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListLinkItem` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListLinkItem = React.forwardRef<HTMLAnchorElement, ListLinkItemProps>(
  ({ title, detail, prefix, suffix, alignItems, rootRef, rootProps, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    return (
      <SeedList.Item ref={rootRef} alignItems={alignItems} {...variantProps} {...rootProps}>
        {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <a ref={ref} {...otherProps}>
            <SeedList.Title>{title}</SeedList.Title>
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </a>
        </SeedList.Content>
        {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListLinkItem.displayName = "ListLinkItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListSwitchItemProps` instead.
 */
export interface ListSwitchItemProps
  extends Omit<SeedList.SwitchItemProps, "title" | "prefix" | "asChild" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListSwitchItem` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListSwitchItem = React.forwardRef<HTMLInputElement, ListSwitchItemProps>(
  ({ title, detail, prefix, suffix, inputProps, rootRef, ...props }, ref) => (
    <SeedList.SwitchItem ref={rootRef} {...props}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      <Switch.HiddenInput ref={ref} {...inputProps} />
    </SeedList.SwitchItem>
  ),
);
ListSwitchItem.displayName = "ListSwitchItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListCheckItemProps` instead.
 */
export interface ListCheckItemProps
  extends Omit<SeedList.CheckItemProps, "title" | "prefix" | "asChild" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListCheckItem` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListCheckItem = React.forwardRef<HTMLInputElement, ListCheckItemProps>(
  ({ title, detail, prefix, suffix, inputProps, rootRef, ...props }, ref) => (
    <SeedList.CheckItem ref={rootRef} {...props}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      <Checkbox.HiddenInput ref={ref} {...inputProps} />
    </SeedList.CheckItem>
  ),
);
ListCheckItem.displayName = "ListCheckItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRadioItemProps` instead.
 */
export interface ListRadioItemProps
  extends Omit<SeedList.RadioItemProps, "title" | "prefix" | "asChild" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRadioItem` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListRadioItem = React.forwardRef<HTMLInputElement, ListRadioItemProps>(
  ({ title, detail, prefix, suffix, inputProps, rootRef, ...props }, ref) => (
    <SeedList.RadioItem ref={rootRef} {...props}>
      {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
      <SeedList.Content>
        <SeedList.Title>{title}</SeedList.Title>
        {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
      </SeedList.Content>
      {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      <RadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
    </SeedList.RadioItem>
  ),
);
ListRadioItem.displayName = "ListRadioItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListDividerProps` instead.
 */
export interface ListDividerProps extends SeedDividerProps {
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
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListDivider` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListDivider = React.forwardRef<HTMLLIElement, ListDividerProps>(
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
ListDivider.displayName = "ListDivider";
