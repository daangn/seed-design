import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";
import clsx from "clsx";
import { article } from "@ride-developer/css/recipes/article";

export interface ArticleProps extends BoxProps {}

export const Article = React.forwardRef<HTMLElement, ArticleProps>(
  ({ as = "article", className, ...props }, ref) => {
    return (
      <Box
        as={as}
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        className={clsx(article(), className)}
        {...props}
      />
    );
  },
);
