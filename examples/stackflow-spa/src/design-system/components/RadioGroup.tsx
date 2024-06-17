import {
  type RadioItemProps,
  type UseRadioGroupProps,
  useRadioGroup,
} from "@seed-design/react-radio-group";
import { type RadioVariantProps, radio } from "@seed-design/recipe/radio";
import clsx from "clsx";
import * as React from "react";

import type { Assign } from "../util/types";
import { visuallyHidden } from "../util/visuallyHidden";

import "@seed-design/stylesheet/radio.css";

const RadioContext = React.createContext<{
  api: ReturnType<typeof useRadioGroup>;
  size: RadioVariantProps["size"];
} | null>(null);

const useRadioContext = () => {
  const context = React.useContext(RadioContext);
  if (!context) {
    throw new Error("Radio cannot be rendered outside the RadioGroup");
  }
  return context;
};

export interface RadioGroupProps
  extends Assign<React.HTMLAttributes<HTMLElement>, UseRadioGroupProps>,
    RadioVariantProps {
  label?: string;
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ className, size = "medium", label, children, ...otherProps }, ref) => {
    const api = useRadioGroup(otherProps);
    const { rootProps } = api;
    return (
      <div ref={ref} {...rootProps} className={className}>
        <RadioContext.Provider value={{ api, size }}>{children}</RadioContext.Provider>
      </div>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioProps
  extends Assign<React.HTMLAttributes<HTMLInputElement>, RadioItemProps>,
    RadioVariantProps {
  label: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size, label, ...otherProps }, ref) => {
    const { api, size: ctxSize } = useRadioContext();
    const { getItemProps } = api;
    const { stateProps, restProps, controlProps, hiddenInputProps, rootProps } =
      getItemProps(otherProps);

    const classNames = radio({ size: size ?? ctxSize });
    return (
      <label className={clsx(classNames.root, className)} {...rootProps} {...restProps}>
        <div {...controlProps} className={classNames.control}>
          <div {...stateProps} className={classNames.icon} />
        </div>
        <input ref={ref} {...hiddenInputProps} style={visuallyHidden} />
        <span {...stateProps} className={classNames.label}>
          {label}
        </span>
      </label>
    );
  },
);
Radio.displayName = "Radio";
