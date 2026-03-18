"use client";

import * as React from "react";
import {
  Field as SeedField,
  FileUpload as SeedFileUpload,
  Icon,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import { useFileUploadContext } from "@seed-design/react/primitive";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import {
  IconCameraFill,
  IconPaperclipFill,
  IconExclamationmarkCircleFill,
  IconArrowUpBracketDownFill,
  IconArrowClockwiseCircularFill,
  IconXmarkFill,
} from "@karrotmarket/react-monochrome-icon";

import { ActionButton } from "./action-button";
import { ProgressCircle } from "./progress-circle";
import { formatBytes } from "../lib/format-bytes";

// You may implement your own i18n for these labels
const LABEL_SELECT_FILE = "파일 선택";
const LABEL_DROP_FILE = "또는 여기로 드래그해서 업로드";
const LABEL_RETRY = "재시도";
const LABEL_REMOVE_FILE = "파일 제거";

export interface FileUploadFieldProps extends Omit<SeedFileUpload.RootProps, "asChild"> {
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

  rootProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadField = React.forwardRef<HTMLInputElement, FileUploadFieldProps>(
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
      rootProps,

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
        "FileUploadField: Provide a `label` prop for better accessibility. This warning will not be shown in production builds.",
      );
    }

    return (
      <SeedField.Root
        {...rootProps}
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
FileUploadField.displayName = "FileUploadField";

export interface FileUploadProps {
  children?: SeedFileUpload.ContextProps["children"];
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(({ children }, ref) => {
  return (
    <SeedFileUpload.Container ref={ref}>
      <SeedFileUpload.Trigger aria-label={LABEL_SELECT_FILE}>
        <SeedFileUpload.TriggerIcon image={<IconCameraFill />} general={<IconPaperclipFill />} />
        <SeedFileUpload.TriggerItemCount />
      </SeedFileUpload.Trigger>
      <SeedFileUpload.ItemGroup>
        <SeedFileUpload.Context>
          {typeof children === "function"
            ? children
            : ({ acceptedFileEntries }) =>
                acceptedFileEntries.map((fileEntry) => (
                  <FileUploadItem key={fileEntry.id} fileEntry={fileEntry} />
                ))}
        </SeedFileUpload.Context>
      </SeedFileUpload.ItemGroup>
    </SeedFileUpload.Container>
  );
});
FileUpload.displayName = "FileUpload";

export interface FileUploadDropzoneProps {
  children?: SeedFileUpload.ContextProps["children"];
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ children }) => {
  const { triggerProps } = useFileUploadContext();

  return (
    <>
      <SeedFileUpload.Dropzone>
        <ActionButton variant="neutralWeak" size="small" layout="withText" {...triggerProps}>
          <PrefixIcon svg={<IconArrowUpBracketDownFill />} />
          {LABEL_SELECT_FILE}
        </ActionButton>
        <SeedFileUpload.DropzoneLabel>{LABEL_DROP_FILE}</SeedFileUpload.DropzoneLabel>
      </SeedFileUpload.Dropzone>
      <SeedFileUpload.Container>
        <SeedFileUpload.ItemGroup>
          <SeedFileUpload.Context>
            {typeof children === "function"
              ? children
              : ({ acceptedFileEntries }) =>
                  acceptedFileEntries.map((fileEntry) => (
                    <FileUploadItem key={fileEntry.id} fileEntry={fileEntry} />
                  ))}
          </SeedFileUpload.Context>
        </SeedFileUpload.ItemGroup>
      </SeedFileUpload.Container>
    </>
  );
};
FileUploadDropzone.displayName = "FileUploadDropzone";

export interface FileUploadItemProps extends Omit<SeedFileUpload.ItemProps, "children"> {
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/react/components/file-upload
 */
export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  ({ onRetry, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();

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
              <ProgressCircle
                size="24"
                value={progress}
                tone={acceptType === "image" ? "staticWhite" : "neutral"}
              />
            ),
            error: (
              <SeedFileUpload.ItemActionButton onClick={onRetry}>
                <Icon svg={<IconArrowClockwiseCircularFill />} />
                {LABEL_RETRY}
              </SeedFileUpload.ItemActionButton>
            ),
          }}
        />
        <SeedFileUpload.ItemRemoveButton aria-label={LABEL_REMOVE_FILE}>
          <Icon svg={<IconXmarkFill />} />
        </SeedFileUpload.ItemRemoveButton>
      </SeedFileUpload.Item>
    );
  },
);
FileUploadItem.displayName = "FileUploadItem";
