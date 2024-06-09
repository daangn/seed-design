import clsx from "clsx";
import * as React from "react";
import { useTextField, UseTextFieldProps } from "@seed-design/react-text-field";

import { Assign } from "../util/types";

// TODO: Change
// import "@seed-design/stylesheet/textfield.css";

export interface TextFieldProps
  extends Assign<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "suffix">,
    UseTextFieldProps
  > {
  /**
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * @default "outlined"
   */
  variant: "outlined" | "underlined";

  requiredIndicator?: string;

  optionalIndicator?: string;

  prefix?: React.ReactNode;

  suffix?: React.ReactNode;

  label?: string;

  description?: string;

  errorMessage?: string;

  hideCharacterCount?: boolean;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    props,
    ref,
  ) => {
    const {
      className,
      size = "medium",
      variant = "outlined",
      requiredIndicator,
      optionalIndicator,
      prefix,
      suffix,
      label,
      description,
      errorMessage,
      hideCharacterCount,
      maxLength,
    } = props;
    const {
      rootProps,
      inputProps,
      labelProps,
      descriptionProps,
      errorMessageProps,
      stateProps,
      restProps,
      isInvalid,
      isRequired,
      graphemes,
    } = useTextField({ ...props, elementType: "input" });

    const showErrorMessage = isInvalid && !!errorMessage;
    const indicator = isRequired ? requiredIndicator : optionalIndicator;
    const showHint = !!description || (errorMessage && isInvalid);
    const renderCharacterCount = !hideCharacterCount && maxLength;
    const renderFoot = showHint || renderCharacterCount;
    const renderHead = label || indicator;

    return (
      <div
        className={clsx(className)}
        {...stateProps}
        {...rootProps}
      >
        {renderHead && (
          <div data-part="head">
            {label && (
              <label
                {...labelProps}
              >
                {label}
              </label>
            )}
            {indicator && (
              <span
                data-part="indicator"
              >
                {indicator}
              </span>
            )}
          </div>
        )}
        <div data-part="field">
          {prefix && (
            <div data-part="prefix">
              {typeof prefix === "string" ? (
                <span>
                  {prefix}
                </span>
              ) : (
                prefix
              )}
            </div>
          )}
          <input
            ref={ref}
            {...inputProps}
            {...restProps}
          />
          {suffix && (
            <div data-part="suffix">
              {typeof suffix === "string" ? (
                <span>
                  {suffix}
                </span>
              ) : (
                suffix
              )}
            </div>
          )}
        </div>
        {renderFoot && (
          <div data-part="foot">
            {showErrorMessage ? (
              <span
                {...stateProps}
                {...errorMessageProps}
              >
                {errorMessage && errorMessage}
              </span>
            ) : (
              <span
                {...stateProps}
                {...descriptionProps}
              >
                {description}
              </span>
            )}
            {renderCharacterCount && (
              <div
                {...stateProps}
                data-part="count-container"
              >
                <span data-part="character-count">{graphemes.length}</span>
                <span data-part="max-count">/{maxLength}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
TextField.displayName = "TextField";
