import { footer, type FooterVariantProps } from "@seed-design/css/recipes/footer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";

export interface FooterLinkTextProps
  extends FooterVariantProps,
    PrimitiveProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const FooterLinkText = React.forwardRef<HTMLAnchorElement, FooterLinkTextProps>(
  ({ className, children, ...props }, ref) => {
    const [variantProps, restProps] = footer.splitVariantProps(props);
    const classNames = footer(variantProps);

    return (
      <Primitive.a ref={ref} className={clsx(classNames.linkText, className)} {...restProps}>
        {children}
      </Primitive.a>
    );
  },
);
FooterLinkText.displayName = "FooterLinkText";
