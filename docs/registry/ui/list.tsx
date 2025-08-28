"use client";

import {
  List as SeedList,
  Checkbox as SeedCheckbox,
  RadioGroup as SeedRadioGroup,
} from "@seed-design/react";
import { listItem } from "@seed-design/css/recipes/list-item";
import { checkmark } from "@seed-design/css/recipes/checkmark";
import { radiomark } from "@seed-design/css/recipes/radiomark";
import { dataAttr } from "@seed-design/dom-utils";
import { Checkmark } from "./checkbox";
import { RadioMark } from "./radio-group";
import * as React from "react";

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
export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ title, detail, prefix, suffix, ...otherProps }, ref) => {
    return (
      <SeedList.Item ref={ref} {...otherProps}>
        {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
        <SeedList.Content>
          <SeedList.Title>{title}</SeedList.Title>{" "}
          {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
        </SeedList.Content>
        {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListItem.displayName = "ListItem";

type ListItemBaseProps = Omit<SeedList.ItemProps, keyof React.HTMLAttributes<HTMLDivElement>>;

export interface ListItemButtonProps
  extends Omit<
    ListItemBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
    "title" | "prefix" | "asChild" | "children"
  > {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  rootRef?: React.Ref<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListItemButton = React.forwardRef<HTMLButtonElement, ListItemButtonProps>(
  ({ title, detail, prefix, suffix, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    const stateProps = React.useMemo(
      () => ({ "data-disabled": dataAttr(otherProps.disabled) }),
      [otherProps.disabled],
    );

    return (
      <SeedList.Item ref={rootRef} {...variantProps}>
        {prefix && <SeedList.Prefix {...stateProps}>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <button type="button" ref={ref} {...otherProps}>
            <SeedList.Title {...stateProps}>{title}</SeedList.Title>{" "}
            {detail && <SeedList.Detail {...stateProps}>{detail}</SeedList.Detail>}
          </button>
        </SeedList.Content>
        {suffix && <SeedList.Suffix {...stateProps}>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListItemButton.displayName = "ListItemButton";

export interface ListItemAnchorProps
  extends Omit<
    ListItemBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "title" | "prefix" | "asChild" | "children"
  > {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  rootRef?: React.Ref<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListItemAnchor = React.forwardRef<HTMLAnchorElement, ListItemAnchorProps>(
  ({ title, detail, prefix, suffix, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = listItem.splitVariantProps(props);

    return (
      <SeedList.Item ref={rootRef} {...variantProps}>
        {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <a ref={ref} {...otherProps}>
            <SeedList.Title>{title}</SeedList.Title>{" "}
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </a>
        </SeedList.Content>
        {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListItemAnchor.displayName = "ListItemAnchor";

export type ListItemCheckboxProps = Omit<
  ListItemBaseProps & SeedCheckbox.RootProps,
  "title" | "prefix" | "asChild" | "children"
> & {
  title: React.ReactNode;
  detail?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
} & (
    | { position: "prefix"; prefix?: never; suffix?: React.ReactNode }
    | { position?: "suffix"; prefix?: React.ReactNode; suffix?: never }
  );

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListItemCheckbox = React.forwardRef<HTMLInputElement, ListItemCheckboxProps>(
  ({ title, detail, position = "suffix", prefix, suffix, inputProps, rootRef, ...props }, ref) => {
    const [variantProps, __otherProps] = listItem.splitVariantProps(props);
    const [{ size = "large", ...otherCheckmarkVariantProps }, otherProps] =
      checkmark.splitVariantProps(__otherProps);

    return (
      <SeedList.Item {...variantProps} asChild>
        <SeedCheckbox.Root.Primitive ref={rootRef} {...otherProps}>
          {(position === "prefix" || prefix) && (
            <SeedList.Prefix>
              {position === "prefix" && (
                <>
                  <Checkmark size={size} {...otherCheckmarkVariantProps} />
                  <SeedCheckbox.HiddenInput ref={ref} {...inputProps} />
                </>
              )}
              {prefix}
            </SeedList.Prefix>
          )}
          <SeedList.Content>
            <SeedList.Title>{title}</SeedList.Title>{" "}
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </SeedList.Content>
          {(position === "suffix" || suffix) && (
            <SeedList.Suffix>
              {position === "suffix" && (
                <>
                  <Checkmark size={size} {...otherCheckmarkVariantProps} />
                  <SeedCheckbox.HiddenInput ref={ref} {...inputProps} />
                </>
              )}
              {suffix}
            </SeedList.Suffix>
          )}
        </SeedCheckbox.Root.Primitive>
      </SeedList.Item>
    );
  },
);
ListItemCheckbox.displayName = "ListItemCheckbox";

export type ListItemRadioProps = Omit<
  ListItemBaseProps & SeedRadioGroup.ItemProps,
  "title" | "prefix" | "asChild" | "children"
> & {
  title: React.ReactNode;
  detail?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
} & (
    | { position: "prefix"; prefix?: never; suffix?: React.ReactNode }
    | { position?: "suffix"; prefix?: React.ReactNode; suffix?: never }
  );

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListItemRadio = React.forwardRef<HTMLInputElement, ListItemRadioProps>(
  ({ title, detail, position = "suffix", prefix, suffix, inputProps, rootRef, ...props }, ref) => {
    const [variantProps, __otherProps] = listItem.splitVariantProps(props);
    const [{ size = "large", ...otherRadiomarkVariantProps }, otherProps] =
      radiomark.splitVariantProps(__otherProps);

    return (
      <SeedList.Item {...variantProps} asChild>
        <SeedRadioGroup.Item.Primitive ref={rootRef} {...otherProps}>
          {(position === "prefix" || prefix) && (
            <SeedList.Prefix>
              {position === "prefix" && (
                <>
                  <RadioMark size={size} {...otherRadiomarkVariantProps} />
                  <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
                </>
              )}
              {prefix}
            </SeedList.Prefix>
          )}
          <SeedList.Content>
            <SeedList.Title>{title}</SeedList.Title>{" "}
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </SeedList.Content>
          {(position === "suffix" || suffix) && (
            <SeedList.Suffix>
              {position === "suffix" && (
                <>
                  <RadioMark size={size} {...otherRadiomarkVariantProps} />
                  <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
                </>
              )}
              {suffix}
            </SeedList.Suffix>
          )}
        </SeedRadioGroup.Item.Primitive>
      </SeedList.Item>
    );
  },
);
ListItemRadio.displayName = "ListItemRadio";
