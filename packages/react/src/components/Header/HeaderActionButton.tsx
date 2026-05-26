import {
  headerActionButton,
  type HeaderActionButtonVariantProps,
} from "@seed-design/css/recipes/header-action-button";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";

export interface HeaderActionButtonProps
  extends HeaderActionButtonVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const HeaderActionButton = React.forwardRef<HTMLButtonElement, HeaderActionButtonProps>(
  (props, ref) => {
    const [variantProps, otherProps] = headerActionButton.splitVariantProps(props);
    const className = headerActionButton(variantProps);

    return (
      <Primitive.button
        ref={ref}
        className={clsx(className, otherProps.className)}
        {...otherProps}
      />
    );
  },
);
HeaderActionButton.displayName = "HeaderActionButton";
