import type * as React from "react";

import { listItem, type ListItemVariantProps } from "@seed-design/css/recipes/list-item";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withStyleProps, type StyleProps } from "../../utils/styled";
import { VStack, type VStackProps } from "../Stack";

const { withContext, withProvider } = createSlotRecipeContext(listItem);

export interface ListRootProps extends VStackProps {}

export const ListRoot = forwardRef<HTMLDivElement, ListRootProps>((props, ref) => {
  return <VStack ref={ref} {...props} />;
});

export interface ListItemProps
  extends PrimitiveProps,
    Pick<StyleProps, "alignItems">,
    React.HTMLAttributes<HTMLDivElement>,
    ListItemVariantProps {}

export const ListItem = withProvider<HTMLDivElement, ListItemProps>(
  withStyleProps(Primitive.div),
  "root",
);

export interface ListContentProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ListContent = withContext<HTMLDivElement, ListContentProps>(
  withStyleProps(Primitive.div),
  "content",
);

export interface ListPrefixProps
  extends PrimitiveProps,
    Pick<StyleProps, "pr" | "paddingRight">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ListPrefix = withContext<HTMLDivElement, ListPrefixProps>(
  withStyleProps(Primitive.div),
  "prefix",
);

export interface ListSuffixProps
  extends PrimitiveProps,
    Pick<StyleProps, "gap" | "position">,
    React.HTMLAttributes<HTMLDivElement> {}

export const ListSuffix = withContext<HTMLDivElement, ListSuffixProps>(
  withStyleProps(Primitive.div),
  "suffix",
);

export interface ListTitleProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const ListTitle = withContext<HTMLSpanElement, ListTitleProps>(Primitive.span, "title");

export interface ListDetailProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const ListDetail = withContext<HTMLSpanElement, ListDetailProps>(Primitive.span, "detail");
