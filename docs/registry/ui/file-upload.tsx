"use client";

import * as React from "react";
import {
  FileUpload as SeedFileUpload,
  Field as SeedField,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import { IconExclamationmarkCircleFill, IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import { formatBytes } from "../lib/format-bytes";

export interface FileUploadProps extends Omit<SeedFileUpload.RootProps, "asChild"> {
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
      readOnly,
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
        readOnly={readOnly}
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
          readOnly={readOnly}
          name={name}
          {...otherProps}
        >
          {children}
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

export interface FileUploadDropzoneProps extends SeedFileUpload.DropzoneProps {}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadDropzone = SeedFileUpload.Dropzone;

export interface FileUploadContainerProps extends SeedFileUpload.ContainerProps {}

/**
 * Flex container that wraps Trigger and ItemGroup together.
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadContainer = SeedFileUpload.Container;

export interface FileUploadTriggerProps extends SeedFileUpload.TriggerProps {}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadTrigger = SeedFileUpload.Trigger;

export interface FileUploadItemGroupProps extends Omit<SeedFileUpload.ItemGroupProps, "children"> {
  children: SeedFileUpload.ContextProps["children"];
}

/**
 * ItemGroup with built-in Context. Children receives file upload context as render prop.
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadItemGroup = React.forwardRef<HTMLUListElement, FileUploadItemGroupProps>(
  ({ children, ...props }, ref) => {
    return (
      <SeedFileUpload.ItemGroup ref={ref} {...props}>
        <SeedFileUpload.Context>{children}</SeedFileUpload.Context>
      </SeedFileUpload.ItemGroup>
    );
  },
);
FileUploadItemGroup.displayName = "FileUploadItemGroup";

export interface FileUploadImageItemProps extends Omit<SeedFileUpload.ItemProps, "children"> {}

/**
 * A convenience component that combines Item, ItemPreview, ItemImage, and ItemDeleteTrigger.
 * Suitable for image file uploads with preview thumbnails.
 *
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadImageItem = React.forwardRef<HTMLLIElement, FileUploadImageItemProps>(
  (props, ref) => {
    return (
      <SeedFileUpload.Item ref={ref} {...props}>
        <SeedFileUpload.ItemPreview>
          <SeedFileUpload.ItemImage />
        </SeedFileUpload.ItemPreview>
        <SeedFileUpload.ItemDeleteTrigger>
          <IconXmarkLine width={10} height={10} />
        </SeedFileUpload.ItemDeleteTrigger>
      </SeedFileUpload.Item>
    );
  },
);
FileUploadImageItem.displayName = "FileUploadImageItem";

export interface FileUploadItemSizeTextProps
  extends Omit<SeedFileUpload.ItemSizeTextProps, "formatBytes"> {}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadItemSizeText = React.forwardRef<
  HTMLSpanElement,
  FileUploadItemSizeTextProps
>((props, ref) => {
  return <SeedFileUpload.ItemSizeText ref={ref} formatBytes={formatBytes} {...props} />;
});
FileUploadItemSizeText.displayName = "FileUploadItemSizeText";
