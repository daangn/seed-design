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

export interface ListRootProps extends VStackProps {
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

export interface ListItemProps
  extends PrimitiveProps,
    Pick<StyleProps, "alignItems">,
    React.HTMLAttributes<HTMLLIElement>,
    ListItemVariantProps {}

export const ListItem = withProvider<HTMLLIElement, ListItemProps>(
  withStateProps(withStyleProps(Primitive.li)),
  "root",
);

export interface ListContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ListContent = withContext<HTMLDivElement, ListContentProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "content",
);

export interface ListPrefixProps
  extends PrimitiveProps,
    Pick<StyleProps, "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ListPrefix = withContext<HTMLDivElement, ListPrefixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "prefix",
);

export interface ListSuffixProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "position">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ListSuffix = withContext<HTMLDivElement, ListSuffixProps>(
  withStateProps(withStyleProps(Primitive.div)),
  "suffix",
);

export interface ListTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const ListTitle = withContext<HTMLDivElement, ListTitleProps>(
  withStateProps(Primitive.div),
  "title",
);

export interface ListDetailProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const ListDetail = withContext<HTMLDivElement, ListDetailProps>(
  withStateProps(Primitive.div),
  "detail",
);
