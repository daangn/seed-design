"use client";

import {
  List as SeedList,
  Checkbox as SeedCheckbox,
  RadioGroup as SeedRadioGroup,
} from "@seed-design/react";
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
  title?: React.ReactNode;
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
          {title && <SeedList.Title>{title}</SeedList.Title>}
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
  extends ListItemBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title" | "prefix" | "prefix" | "suffix"> {
  title?: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;

  rootRef?: React.Ref<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/list
 */
export const ListItemButton = React.forwardRef<HTMLButtonElement, ListItemButtonProps>(
  ({ title, detail, prefix, suffix, rootRef, ...otherProps }, ref) => {
    return (
      <SeedList.Item ref={rootRef}>
        {prefix && <SeedList.Prefix>{prefix}</SeedList.Prefix>}
        <SeedList.Content asChild>
          <button type="button" ref={ref} {...otherProps}>
            {title && <SeedList.Title>{title}</SeedList.Title>}
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </button>
        </SeedList.Content>
        {suffix && <SeedList.Suffix>{suffix}</SeedList.Suffix>}
      </SeedList.Item>
    );
  },
);
ListItemButton.displayName = "ListItemButton";

// ListItemVariantProps가 필요함!!
export type ListItemCheckboxProps = Omit<
  SeedCheckbox.RootProps,
  "title" | "prefix" | "asChild" | "children"
> & {
  title?: React.ReactNode;
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
  (
    { title, detail, position = "suffix", prefix, suffix, inputProps, rootRef, ...otherProps },
    ref,
  ) => {
    return (
      <SeedList.Item asChild>
        <SeedCheckbox.Root.Primitive ref={rootRef} {...otherProps}>
          {(position === "prefix" || prefix) && (
            <SeedList.Prefix>
              {position === "prefix" && ( // checkmark로 variant 넘겨줘야 함
                <>
                  <Checkmark />
                  <SeedCheckbox.HiddenInput ref={ref} {...inputProps} />
                </>
              )}
              {prefix}
            </SeedList.Prefix>
          )}
          <SeedList.Content>
            {title && <SeedList.Title>{title}</SeedList.Title>}
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </SeedList.Content>
          {(position === "suffix" || suffix) && (
            <SeedList.Suffix>
              {position === "suffix" && (
                <>
                  <Checkmark />
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
  SeedRadioGroup.ItemProps,
  "title" | "prefix" | "asChild" | "children"
> & {
  title?: React.ReactNode;
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
  (
    { title, detail, position = "suffix", prefix, suffix, inputProps, rootRef, ...otherProps },
    ref,
  ) => {
    return (
      <SeedList.Item asChild>
        <SeedRadioGroup.Item.Primitive ref={rootRef} {...otherProps}>
          {(position === "prefix" || prefix) && (
            <SeedList.Prefix>
              {position === "prefix" && (
                <>
                  <RadioMark />
                  <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
                </>
              )}
              {prefix}
            </SeedList.Prefix>
          )}
          <SeedList.Content>
            {title && <SeedList.Title>{title}</SeedList.Title>}
            {detail && <SeedList.Detail>{detail}</SeedList.Detail>}
          </SeedList.Content>
          {(position === "suffix" || suffix) && (
            <SeedList.Suffix>
              {position === "suffix" && (
                <>
                  <RadioMark />
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
