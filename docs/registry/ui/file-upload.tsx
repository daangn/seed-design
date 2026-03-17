"use client";

import * as React from "react";
import {
  FileUpload as SeedFileUpload,
  Field as SeedField,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import {
  IconCameraFill,
  IconPaperclipFill,
  IconExclamationmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import { FileUploadItem } from "./file-upload-item";

export type {
  FileWithStatus,
  FileStatusDetails,
  FileAcceptType,
} from "@seed-design/react/primitive";

export interface FileUploadProps extends Omit<SeedFileUpload.RootProps, "asChild" | "children"> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];

  indicator?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;

  showRequiredIndicator?: boolean;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  fieldRef?: React.Ref<HTMLDivElement>;

  /**
   * Optional render function that receives file upload context ({ acceptedFiles, updateFileStatus, removeFile, clearFiles }).
   * When omitted, a default item list is rendered.
   */
  children?: SeedFileUpload.ContextProps["children"];
}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
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
      name,

      showRequiredIndicator,

      inputProps,
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
        "FileUpload: Provide a `label` prop for better accessibility. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        required={required}
        disabled={disabled}
        invalid={invalid}
        name={name}
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
        <SeedFileUpload.Root
          required={required}
          disabled={disabled}
          invalid={invalid}
          name={name}
          {...otherProps}
        >
          <SeedFileUpload.Container>
            {/* You may implement your own i18n for upload label */}
            <SeedFileUpload.Trigger aria-label="파일 선택">
              <SeedFileUpload.TriggerIcon
                image={<IconCameraFill />}
                general={<IconPaperclipFill />}
              />
              <SeedFileUpload.TriggerItemCount />
            </SeedFileUpload.Trigger>
            <SeedFileUpload.ItemGroup>
              <SeedFileUpload.Context>
                {typeof children === "function"
                  ? children
                  : ({ acceptedFiles }) =>
                      acceptedFiles.map((fileWithStatus, index) => (
                        <FileUploadItem
                          key={`${fileWithStatus.file.name}-${index}`}
                          fileWithStatus={fileWithStatus}
                        />
                      ))}
              </SeedFileUpload.Context>
            </SeedFileUpload.ItemGroup>
          </SeedFileUpload.Container>
          <SeedFileUpload.HiddenInput ref={ref} {...inputProps} />
        </SeedFileUpload.Root>
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
FileUpload.displayName = "FileUpload";
