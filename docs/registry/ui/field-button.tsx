"use client";

import * as React from "react";
import { FieldButton as SeedFieldButton } from "@seed-design/react";
import { visuallyHidden } from "@seed-design/dom-utils";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

export interface FieldButtonProps extends Omit<SeedFieldButton.RootProps, "prefix"> {
  label?: React.ReactNode;
  indicator?: React.ReactNode;

  prefixIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffix?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * @see https://seed-design.io/react/components/field-button
 */
export const FieldButton = React.forwardRef<HTMLDivElement, FieldButtonProps>(
  (
    {
      prefix,
      prefixIcon,
      suffix,
      suffixIcon,
      label,
      indicator,
      description,
      errorMessage,
      children,

      required,
      disabled,
      invalid,
      readOnly,
      name,

      onButtonClick,

      ...otherProps
    },
    ref,
  ) => {
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderFooter = renderDescription || renderErrorMessage;
    const renderHeader = label || indicator;

    // label이 없는데 **Button**에 aria-label이 없으면 알려줘야 해
    // prop을 어떻게 받지? 하..
    // RootProps를 받아야되는데 label에 꽂아줘야 하는 애들도 있어..
    // buttonProps를 받아야 하나

    // if (
    //   !label &&
    //   !otherProps["aria-labelledby"] &&
    //   !otherProps["aria-label"] &&
    //   process.env.NODE_ENV !== "production"
    // ) {
    //   console.warn(
    //     "TextField: aria-labelledby or aria-label should be provided if label is not provided.",
    //   );
    // }

    // we are manually assigning the size to SeedFieldButton.Root because the variant props might not always match

    return (
      <SeedFieldButton.Root
        size={otherProps.size}
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        name={name}
        ref={ref}
        {...otherProps}
      >
        {renderHeader && (
          <SeedFieldButton.Header>
            {label && <SeedFieldButton.Label>{label}</SeedFieldButton.Label>}
            {indicator && <SeedFieldButton.Indicator>{indicator}</SeedFieldButton.Indicator>}
          </SeedFieldButton.Header>
        )}
        <SeedFieldButton.Foobar>
          <SeedFieldButton.Button type="button" onClick={onButtonClick} />
          {prefixIcon && <SeedFieldButton.PrefixIcon svg={prefixIcon} />}
          {prefix && <SeedFieldButton.PrefixText>{prefix}</SeedFieldButton.PrefixText>}
          {/* TODO: aria-hidden */}
          {children}
          {suffix && <SeedFieldButton.SuffixText>{suffix}</SeedFieldButton.SuffixText>}
          {suffixIcon && <SeedFieldButton.SuffixIcon svg={suffixIcon} />}
        </SeedFieldButton.Foobar>
        {renderFooter && (
          <SeedFieldButton.Footer>
            {renderDescription && (
              <SeedFieldButton.Description {...(renderErrorMessage && { style: visuallyHidden })}>
                {description}
              </SeedFieldButton.Description>
            )}
            {renderErrorMessage && (
              <>
                <SeedFieldButton.ErrorIcon svg={<IconExclamationmarkCircleFill />} />
                <SeedFieldButton.ErrorMessage>{errorMessage}</SeedFieldButton.ErrorMessage>
              </>
            )}
          </SeedFieldButton.Footer>
        )}
        <SeedFieldButton.HiddenInputs />
      </SeedFieldButton.Root>
    );
  },
);
FieldButton.displayName = "FieldButton";

export interface FieldButtonValueProps extends SeedFieldButton.ValueProps {
  placeholder?: React.ReactNode;
}

export const FieldButtonValue = React.forwardRef<HTMLDivElement, FieldButtonValueProps>(
  ({ placeholder, ...otherProps }, ref) => {
    if (
      placeholder &&
      (otherProps.children === null ||
        otherProps.children === undefined ||
        otherProps.children === "") // TODO
    ) {
      return (
        <SeedFieldButton.Placeholder ref={ref} {...otherProps}>
          {placeholder}
        </SeedFieldButton.Placeholder>
      );
    }

    return <SeedFieldButton.Value ref={ref} {...otherProps} />;
  },
);
