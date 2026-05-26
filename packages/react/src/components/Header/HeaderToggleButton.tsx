import {
  headerToggleButton,
  type HeaderToggleButtonVariantProps,
} from "@seed-design/css/recipes/header-toggle-button";
import { Toggle as TogglePrimitive } from "@seed-design/react-toggle";
import clsx from "clsx";
import * as React from "react";

export interface HeaderToggleButtonProps
  extends HeaderToggleButtonVariantProps,
    TogglePrimitive.RootProps {}

export const HeaderToggleButton = React.forwardRef<HTMLButtonElement, HeaderToggleButtonProps>(
  (props, ref) => {
    const [variantProps, otherProps] = headerToggleButton.splitVariantProps(props);
    const className = headerToggleButton(variantProps);

    return (
      <TogglePrimitive.Root
        ref={ref}
        className={clsx(className, otherProps.className)}
        {...otherProps}
      />
    );
  },
);
HeaderToggleButton.displayName = "HeaderToggleButton";
