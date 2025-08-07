"use client";

import * as React from "react"; // "@daangn/react-monochrome-icon"과 동일합니다.
import { TextField as SeedTextField } from "@seed-design/react";

export interface TextFieldInputProps extends Omit<SeedTextField.RootProps, "prefix"> {
  prefixIcon?: React.ReactNode;

  prefix?: React.ReactNode;

  suffixIcon?: React.ReactNode;

  suffix?: React.ReactNode;

  rootRef?: React.Ref<HTMLDivElement>;

  inputProps?: SeedTextField.InputProps;
}

/**
 * @see https://seed-design.io/react/components/text-field
 */
export const TextFieldInput = React.forwardRef<HTMLInputElement, TextFieldInputProps>(
  ({ prefix, prefixIcon, suffix, suffixIcon, size, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedTextField.Root ref={rootRef} size={size} {...otherProps}>
        {prefixIcon && <SeedTextField.PrefixIcon svg={prefixIcon} />}
        {prefix && <SeedTextField.PrefixText>{prefix}</SeedTextField.PrefixText>}
        <SeedTextField.Input ref={ref} {...inputProps} />
        {suffix && <SeedTextField.SuffixText>{suffix}</SeedTextField.SuffixText>}
        {suffixIcon && <SeedTextField.SuffixIcon svg={suffixIcon} />}
      </SeedTextField.Root>
    );
  },
);
TextFieldInput.displayName = "TextFieldInput";

export interface TextFieldTextareaProps extends SeedTextField.RootProps {
  rootRef?: React.Ref<HTMLDivElement>;

  textareaProps?: SeedTextField.TextareaProps;
}

export const TextFieldTextarea = React.forwardRef<HTMLTextAreaElement, TextFieldTextareaProps>(
  ({ size, textareaProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedTextField.Root ref={rootRef} size={size} {...otherProps}>
        <SeedTextField.Textarea ref={ref} {...textareaProps} />
      </SeedTextField.Root>
    );
  },
);
