import { linkContent, type LinkContentVariantProps } from "@seed-design/css/recipes/link-content";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createStyleContext } from "../../utils/createStyleContext";

import type * as React from "react";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withProvider } = createStyleContext(linkContent);

export interface LinkContentProps
  extends LinkContentVariantProps,
    PrimitiveProps,
    Pick<StyleProps, "color">,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {}

export const LinkContent = withProvider<HTMLButtonElement, LinkContentProps>(
  withStyleProps(Primitive.span),
  "root",
);
