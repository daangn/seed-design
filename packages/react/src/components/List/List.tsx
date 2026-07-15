import type * as React from "react";

import { listItem, type ListItemVariantProps } from "@seed-design/css/recipes/list-item";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { handleRadius, withStyleProps, type StyleProps } from "../../utils/styled";
import { VStack, type VStackProps } from "../Stack";
import { useCheckboxContext } from "@seed-design/react-checkbox";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { useRadioGroupItemContext } from "@seed-design/react-radio-group";
import { useSwitchContext } from "@seed-design/react-switch";

const { withContext, withProvider } = createSlotRecipeContext(listItem);
const withStateProps = createWithStateProps([
  { useContext: useCheckboxContext, strict: false },
  { useContext: useRadioGroupItemContext, strict: false },
  { useContext: useSwitchContext, strict: false },
]);

export interface ListRootProps
  extends Omit<
    VStackProps,
    "bleed" | "bleedX" | "bleedY" | "bleedTop" | "bleedRight" | "bleedBottom" | "bleedLeft"
  > {
  itemBorderRadius?: StyleProps["borderRadius"];
}

export const ListRoot = forwardRef<HTMLUListElement, ListRootProps>(
  ({ as = "ul", style, itemBorderRadius, ...props }, ref) => {
    return (
      <VStack
        as={as}
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        style={
          {
            ...style,
            "--list-item-border-radius": handleRadius(itemBorderRadius),
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListItemProps instead.
 */
export interface ListItemProps
  extends PrimitiveProps,
    Pick<StyleProps, "alignItems">,
    React.HTMLAttributes<HTMLLIElement>,
    ListItemVariantProps {}

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListItem instead.
 */
export const ListItem = withProvider<HTMLLIElement, ListItemProps>(
  withStateProps(withStyleProps(Primitive.li)),
  "root",
);

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListContentProps instead.
 */
export interface ListContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListContent instead.
 */
export const ListContent = withContext<HTMLDivElement, ListContentProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "content",
);

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListPrefixProps instead.
 */
export interface ListPrefixProps
  extends PrimitiveProps,
    Pick<StyleProps, "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListPrefix instead.
 */
export const ListPrefix = withContext<HTMLDivElement, ListPrefixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "prefix",
);

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListSuffixProps instead.
 */
export interface ListSuffixProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "position">,
    React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListSuffix instead.
 */
export const ListSuffix = withContext<HTMLDivElement, ListSuffixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "suffix",
);

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListTitleProps instead.
 */
export interface ListTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListTitle instead.
 */
export const ListTitle = withContext<HTMLDivElement, ListTitleProps>(
  withStateProps(Primitive.div),
  "title",
);

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListDetailProps instead.
 */
export interface ListDetailProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

/**
 * @deprecated Deprecated in @seed-design/react@2.1.0; will be removed in 3.0.0. Use NextListDetail instead.
 */
export const ListDetail = withContext<HTMLDivElement, ListDetailProps>(
  withStateProps(Primitive.div),
  "detail",
);
