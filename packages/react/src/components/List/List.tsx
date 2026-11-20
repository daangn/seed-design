import type * as React from "react";

import { listItem, type ListItemVariantProps } from "@seed-design/css/recipes/list-item";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";
import {
  NextListRadioRoot,
  NextListRoot,
  type NextListRadioRootProps,
  type NextListRootProps,
} from "../NextList/NextList";
import { Checkbox as CheckboxPrimitive, useCheckboxContext } from "@seed-design/react-checkbox";
import { createWithStateProps } from "../../utils/createWithStateProps";
import {
  RadioGroup as RadioGroupPrimitive,
  useRadioGroupItemContext,
} from "@seed-design/react-radio-group";
import { Switch as SwitchPrimitive, useSwitchContext } from "@seed-design/react-switch";

const { withContext, withProvider } = createSlotRecipeContext(listItem);
const withStateProps = createWithStateProps([
  { useContext: useCheckboxContext, strict: false },
  { useContext: useRadioGroupItemContext, strict: false },
  { useContext: useSwitchContext, strict: false },
]);

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRootProps` instead.
 */
export interface ListRootProps extends NextListRootProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRoot` instead.
 */
export const ListRoot = NextListRoot;

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListItemProps` instead.
 */
export interface ListItemProps
  extends PrimitiveProps,
    Pick<StyleProps, "alignItems">,
    React.HTMLAttributes<HTMLLIElement>,
    ListItemVariantProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListItem` instead.
 */
export const ListItem = withProvider<HTMLLIElement, ListItemProps>(
  withStateProps(withStyleProps(Primitive.li)),
  "root",
);

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListCheckboxItemProps` instead.
 */
export interface ListCheckItemProps
  extends ListItemVariantProps,
    Pick<StyleProps, "alignItems">,
    CheckboxPrimitive.RootProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListCheckboxItem` instead.
 */
export const ListCheckItem = withProvider<HTMLLabelElement, ListCheckItemProps>(
  withStyleProps(CheckboxPrimitive.Root),
  "root",
);
ListCheckItem.displayName = "List.CheckItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRadioRootProps` instead.
 */
export interface ListRadioRootProps extends NextListRadioRootProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRadioRoot` instead.
 */
export const ListRadioRoot = NextListRadioRoot;

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRadioItemProps` instead.
 */
export interface ListRadioItemProps
  extends ListItemVariantProps,
    Pick<StyleProps, "alignItems">,
    RadioGroupPrimitive.ItemProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListRadioItem` instead.
 */
export const ListRadioItem = withProvider<HTMLLabelElement, ListRadioItemProps>(
  withStyleProps(RadioGroupPrimitive.Item),
  "root",
);
ListRadioItem.displayName = "List.RadioItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListSwitchItemProps` instead.
 */
export interface ListSwitchItemProps
  extends ListItemVariantProps,
    Pick<StyleProps, "alignItems">,
    SwitchPrimitive.RootProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListSwitchItem` instead.
 */
export const ListSwitchItem = withProvider<HTMLLabelElement, ListSwitchItemProps>(
  withStyleProps(SwitchPrimitive.Root),
  "root",
);
ListSwitchItem.displayName = "List.SwitchItem";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListContentProps` instead.
 */
export interface ListContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListContent` instead.
 */
export const ListContent = withContext<HTMLDivElement, ListContentProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "content",
);

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListPrefixProps` instead.
 */
export interface ListPrefixProps
  extends PrimitiveProps,
    Pick<StyleProps, "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListPrefix` instead.
 */
export const ListPrefix = withContext<HTMLDivElement, ListPrefixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "prefix",
);

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListSuffixProps` instead.
 */
export interface ListSuffixProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "position">,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListSuffix` instead.
 */
export const ListSuffix = withContext<HTMLDivElement, ListSuffixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "suffix",
);

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListTitleProps` instead.
 */
export interface ListTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListTitle` instead.
 */
export const ListTitle = withContext<HTMLDivElement, ListTitleProps>(
  withStateProps(Primitive.div),
  "title",
);

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListDetailProps` instead.
 */
export interface ListDetailProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListDetail` instead.
 */
export const ListDetail = withContext<HTMLDivElement, ListDetailProps>(
  withStateProps(Primitive.div),
  "detail",
);
