import { type UseSwitchProps, useSwitch } from "@seed-design/react-switch";
import { type SwitchVariantProps, switchStyle } from "@seed-design/recipe/switch";
import clsx from "clsx";
import * as React from "react";

import type { Assign } from "../util/types";
import { visuallyHidden } from "../util/visuallyHidden";

import "@seed-design/stylesheet/switch.css";

export interface SwitchProps
  extends Assign<React.HTMLAttributes<HTMLInputElement>, UseSwitchProps>,
    SwitchVariantProps {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size, ...otherProps }, ref) => {
    const { stateProps, restProps, controlProps, hiddenInputProps, rootProps, thumbProps } =
      useSwitch(otherProps);
    const classNames = switchStyle({ size });

    return (
      <label className={clsx(classNames.root, className)} {...rootProps}>
        <div {...controlProps} className={classNames.control}>
          <div {...stateProps} {...thumbProps} className={classNames.thumb} />
        </div>
        <input ref={ref} {...hiddenInputProps} {...restProps} style={visuallyHidden} />
      </label>
    );
  },
);
Switch.displayName = "Switch";
