// Note for AI Agents: Only the shipped formats (ResidentNumberField, CardNumberField) are supported; if you need to compose SegmentedTextField or SegmentedTextInput into any other format, stop and tell the user before writing code.
"use client";

import * as React from "react";
import {
  SegmentedTextInput as SeedSegmentedTextInput,
  Field as SeedField,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

export interface SegmentedTextFieldProps extends Omit<SeedSegmentedTextInput.RootProps, "asChild"> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedField.LabelProps["weight"];

  indicator?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  showRequiredIndicator?: boolean;

  fieldRef?: React.Ref<HTMLDivElement>;
}

/**
 * children에 `SegmentedTextFieldSegment`·`SegmentedTextFieldSeparator`·`SegmentedTextFieldSuffix`를 조합합니다.
 * 값은 입력 Segment 순서대로 `string[]`입니다. `staticText` Segment는 값에 포함하지 않습니다.
 *
 * @see https://seed-design.io/react/components/segmented-text-input
 */
export const SegmentedTextField = React.forwardRef<HTMLDivElement, SegmentedTextFieldProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,
      children,

      // field props
      required,
      disabled,
      invalid,
      readOnly,

      showRequiredIndicator,

      fieldRef,

      ...otherProps
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    if (process.env.NODE_ENV !== "production" && !label) {
      console.warn(
        "SegmentedTextField: Provide a `label` prop for better accessibility. Please ignore this warning if you've provided `aria-label` or `aria-labelledby`. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        required={required}
        disabled={disabled}
        invalid={invalid}
        readOnly={readOnly}
        ref={fieldRef}
      >
        {renderHeader && (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedField.RequiredIndicator />}
              {indicator && <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>}
            </SeedField.Label>
            {/* You might want to put your custom element here */}
          </SeedField.Header>
        )}
        <SeedSegmentedTextInput.Root ref={ref} {...otherProps}>
          {children}
        </SeedSegmentedTextInput.Root>
        {renderFooter && (
          <SeedField.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <SeedField.Description>{description}</SeedField.Description>
                </VisuallyHidden>
              ) : (
                <SeedField.Description>{description}</SeedField.Description>
              ))}
            {renderErrorMessage && (
              <SeedField.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedField.ErrorMessage>
            )}
          </SeedField.Footer>
        )}
      </SeedField.Root>
    );
  },
);
SegmentedTextField.displayName = "SegmentedTextField";

export type SegmentedTextFieldSegmentProps = SeedSegmentedTextInput.SegmentProps;

/**
 * @see https://seed-design.io/react/components/segmented-text-input
 */
export const SegmentedTextFieldSegment = SeedSegmentedTextInput.Segment;

export interface SegmentedTextFieldSeparatorProps extends SeedSegmentedTextInput.SeparatorProps {}

export const SegmentedTextFieldSeparator = SeedSegmentedTextInput.Separator;

export interface SegmentedTextFieldDotsProps extends SeedSegmentedTextInput.DotsProps {}

export const SegmentedTextFieldDots = SeedSegmentedTextInput.Dots;

export interface SegmentedTextFieldSuffixProps extends SeedSegmentedTextInput.SuffixProps {}

export const SegmentedTextFieldSuffix = SeedSegmentedTextInput.Suffix;
