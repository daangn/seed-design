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
  IconExclamationmarkCircleFill,
  IconArrowUpBracketDownFill,
} from "@karrotmarket/react-monochrome-icon";
import { FileUploadItem } from "./file-upload-item";
import { LoadingIndicator } from "./loading-indicator";

export interface FileUploadDropzoneProps
  extends Omit<SeedFileUpload.RootProps, "asChild" | "children"> {
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
export const FileUploadDropzone = React.forwardRef<HTMLInputElement, FileUploadDropzoneProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,
      children,

      inputProps,
      fieldRef,

      ...props
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && props.invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    if (process.env.NODE_ENV !== "production" && !label) {
      console.warn(
        "FileUploadDropzone: Provide a `label` prop for better accessibility. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        name={props.name}
        disabled={props.disabled}
        required={props.required}
        invalid={props.invalid}
        readOnly={props.readOnly}
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
        <SeedFileUpload.Root {...props}>
          <SeedFileUpload.Dropzone>
            <SeedFileUpload.DropzoneActionButton
              variant="neutralWeak"
              size="small"
              layout="withText"
            >
              <PrefixIcon svg={<IconArrowUpBracketDownFill />} />
              {/* You may implement your own i18n for upload label */}
              파일 선택
            </SeedFileUpload.DropzoneActionButton>
            <SeedFileUpload.DropzoneLabel>
              {/* You may implement your own i18n for upload label */}
              또는 여기로 드래그해서 업로드
            </SeedFileUpload.DropzoneLabel>
          </SeedFileUpload.Dropzone>
          <SeedFileUpload.Container>
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
FileUploadDropzone.displayName = "FileUploadDropzone";

interface FileUploadDropzoneActionButtonProps extends SeedFileUpload.DropzoneActionButtonProps {}

export const FileUploadDropzoneActionButton = React.forwardRef<
  React.ElementRef<typeof SeedFileUpload.DropzoneActionButton>,
  FileUploadDropzoneActionButtonProps
>(({ loading = false, children, ...otherProps }, ref) => {
  return (
    <SeedFileUpload.DropzoneActionButton ref={ref} loading={loading} {...otherProps}>
      {loading && !otherProps.asChild ? <LoadingIndicator>{children}</LoadingIndicator> : children}
    </SeedFileUpload.DropzoneActionButton>
  );
});
FileUploadDropzoneActionButton.displayName = "FileUploadDropzoneActionButton";
