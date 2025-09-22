"use client";

import {
  List as SeedList,
  Divider as SeedDivider,
  type DividerProps as SeedDividerProps,
  ListHeader as SeedListHeader,
  type ListHeaderProps as SeedListHeaderProps,
} from "@seed-design/react";
import {
  Checkbox as CheckboxPrimitive,
  RadioGroup as RadioGroupPrimitive,
} from "@seed-design/react/primitive";
import { listItem } from "@seed-design/css/recipes/list-item";
import * as React from "react";

export interface ListHeaderProps extends SeedListHeaderProps {}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListHeader = SeedListHeader;

export interface ListProps extends SeedList.RootProps {}

/**
 * @see https://seed-design.io/react/components/list
 */
export const List = SeedList.Root;

export interface ListItemProps
  extends Omit<SeedList.ItemProps, "title" | "prefix" | "asChild" | "children"> {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

/**
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
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListButtonItem = React.forwardRef<HTMLButtonElement, ListButtonItemProps>(
  ({ title, detail, prefix, suffix, alignItems, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    const stateProps = React.useMemo(
      () => ({ "data-disabled": otherProps.disabled ? "" : undefined }),
      [otherProps.disabled],
    );

    return (
      <SeedList.Item ref={rootRef} alignItems={alignItems} {...variantProps}>
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
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListLinkItem = React.forwardRef<HTMLAnchorElement, ListLinkItemProps>(
  ({ title, detail, prefix, suffix, alignItems, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    return (
      <SeedList.Item ref={rootRef} alignItems={alignItems} {...variantProps}>
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

export interface ListCheckItemProps
  extends Omit<
    ListItemBaseProps & CheckboxPrimitive.RootProps,
    "title" | "prefix" | "asChild" | "children"
  > {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListCheckItem = React.forwardRef<HTMLInputElement, ListCheckItemProps>(
  ({ title, detail, prefix, suffix, inputProps, alignItems, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    return (
      <SeedList.Item {...variantProps} alignItems={alignItems} asChild>
        <CheckboxPrimitive.Root ref={rootRef} {...otherProps}>
          {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
          <SeedList.Content>
            <SeedList.Title>{title}</SeedList.Title>
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </SeedList.Content>
          {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
          <CheckboxPrimitive.HiddenInput ref={ref} {...inputProps} />
        </CheckboxPrimitive.Root>
      </SeedList.Item>
    );
  },
);
ListCheckItem.displayName = "ListCheckItem";

export interface ListRadioItemProps
  extends Omit<
    ListItemBaseProps & RadioGroupPrimitive.ItemProps,
    "title" | "prefix" | "asChild" | "children"
  > {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListRadioItem = React.forwardRef<HTMLInputElement, ListRadioItemProps>(
  ({ title, detail, prefix, suffix, inputProps, alignItems, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    return (
      <SeedList.Item {...variantProps} alignItems={alignItems} asChild>
        <RadioGroupPrimitive.Item ref={rootRef} {...otherProps}>
          {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
          <SeedList.Content>
            <SeedList.Title>{title}</SeedList.Title>
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </SeedList.Content>
          {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
          <RadioGroupPrimitive.ItemHiddenInput ref={ref} {...inputProps} />
        </RadioGroupPrimitive.Item>
      </SeedList.Item>
    );
  },
);
ListRadioItem.displayName = "ListRadioItem";

export interface ListDividerProps extends SeedDividerProps {
  /**
   * @default "li"
   */
  as?: SeedDividerProps["as"]; // this redeclaration is for JSDoc

  /**
   * @default true
   */
  "aria-hidden"?: SeedDividerProps["aria-hidden"]; // this redeclaration is for JSDoc
}

/**
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
