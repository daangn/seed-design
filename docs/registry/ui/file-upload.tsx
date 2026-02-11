"use client";

import * as React from "react";
import {
  FileUpload as SeedFileUpload,
  Field as SeedField,
  Icon,
  VisuallyHidden,
  PrefixIcon,
} from "@seed-design/react";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import {
  IconCameraFill,
  IconArrowClockwiseCircularFill,
  IconPaperclipFill,
  IconXmarkFill,
  IconExclamationmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import { formatBytes } from "../lib/format-bytes";

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
   * Children can be ReactNode or a render function that receives file upload context.
   */
  children?: React.ReactNode | SeedFileUpload.ContextProps["children"];
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
          {typeof children === "function" ? (
            <SeedFileUpload.Context>{children}</SeedFileUpload.Context>
          ) : (
            children
          )}
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

export interface FileUploadTriggerProps extends Omit<SeedFileUpload.TriggerProps, "children"> {}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadTrigger = React.forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
  (props, ref) => {
    return (
      <SeedFileUpload.Trigger
        // You may implement your own i18n for upload label
        aria-label="파일 선택"
        ref={ref}
        {...props}
      >
        <SeedFileUpload.TriggerIcon image={<IconCameraFill />} general={<IconPaperclipFill />} />
        <SeedFileUpload.TriggerItemCount />
      </SeedFileUpload.Trigger>
    );
  },
);
FileUploadTrigger.displayName = "FileUploadTrigger";

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

export interface FileUploadImageItemProps extends Omit<SeedFileUpload.ItemProps, "children"> {
  onRetry?: () => void;
}

/**
 * A convenience component that combines Item, ItemPreview, ItemImage, ItemIndicator, and ItemRemoveTrigger.
 * Includes built-in upload status indicator with FileUploadItemProgressCircle, success icon, and retry button.
 *
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadImageItemProps>(
  ({ onRetry, ...props }, ref) => {
    return (
      <SeedFileUpload.Item ref={ref} {...props}>
        <SeedFileUpload.ItemPreview
          image={<SeedFileUpload.ItemImage />}
          general={
            <>
              <SeedFileUpload.ItemThumbnail fallback={<Icon svg={<IconPaperclipFill />} />} />
              <SeedFileUpload.ItemMetadata>
                <SeedFileUpload.ItemName />
                <SeedFileUpload.ItemSizeText formatBytes={formatBytes} />
              </SeedFileUpload.ItemMetadata>
            </>
          }
          overlay={{
            uploading: ({ progress }) => (
              <FileUploadItemProgressCircle size="24" value={progress} />
            ),
            error: (
              <SeedFileUpload.ItemActionButton onClick={onRetry}>
                <Icon svg={<IconArrowClockwiseCircularFill />} />
                {/* You may implement your own i18n for retry label */}
                재시도
              </SeedFileUpload.ItemActionButton>
            ),
          }}
        />
        {/* You may implement your own i18n for remove label */}
        <SeedFileUpload.ItemRemoveButton aria-label="파일 제거">
          <Icon svg={<IconXmarkFill />} />
        </SeedFileUpload.ItemRemoveButton>
      </SeedFileUpload.Item>
    );
  },
);
FileUploadItem.displayName = "FileUploadItem";

interface FileUploadItemProgressCircleProps extends SeedFileUpload.ItemProgressCircleRootProps {}

const FileUploadItemProgressCircle = React.forwardRef<
  SVGSVGElement,
  FileUploadItemProgressCircleProps
>((props, ref) => (
  <SeedFileUpload.ItemProgressCircleRoot ref={ref} {...props}>
    <SeedFileUpload.ItemProgressCircleTrack />
    <SeedFileUpload.ItemProgressCircleRange />
  </SeedFileUpload.ItemProgressCircleRoot>
));
FileUploadItemProgressCircle.displayName = "FileUploadItemProgressCircle";

export type { FileStatusDetails, FileWithStatus } from "@seed-design/react";
