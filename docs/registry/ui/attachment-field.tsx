"use client";

import * as React from "react";
import {
  Field as SeedField,
  AttachmentInput as SeedAttachmentInput,
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

export interface AttachmentFieldProps extends Omit<SeedAttachmentInput.RootProps, "asChild"> {
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
 * @see https://seed-design.io/react/components/attachment-field
 */
export const AttachmentField = React.forwardRef<HTMLInputElement, AttachmentFieldProps>(
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
        "AttachmentField: Provide a `label` prop for better accessibility. This warning will not be shown in production builds.",
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
        <SeedAttachmentInput.Root {...props}>
          {children}
          <SeedAttachmentInput.HiddenInput ref={ref} {...inputProps} />
        </SeedAttachmentInput.Root>
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
AttachmentField.displayName = "AttachmentField";

export interface AttachmentInputProps {
  children?: SeedAttachmentInput.ContextProps["children"];
}

export const AttachmentInput = React.forwardRef<HTMLDivElement, AttachmentInputProps>(
  ({ children }, ref) => {
    return (
      <SeedAttachmentInput.Container ref={ref}>
        <SeedAttachmentInput.Trigger aria-label={LABEL_SELECT_FILE}>
          <SeedAttachmentInput.TriggerIcon
            image={<IconCameraFill />}
            general={<IconPaperclipFill />}
          />
          <SeedAttachmentInput.TriggerItemCount />
        </SeedAttachmentInput.Trigger>
        <SeedAttachmentInput.ItemGroup>
          <SeedAttachmentInput.Context>
            {typeof children === "function"
              ? children
              : ({ acceptedFileEntries }) =>
                  acceptedFileEntries.map((fileEntry) => (
                    <AttachmentInputItem key={fileEntry.id} fileEntry={fileEntry} />
                  ))}
          </SeedAttachmentInput.Context>
        </SeedAttachmentInput.ItemGroup>
      </SeedAttachmentInput.Container>
    );
  },
);
AttachmentInput.displayName = "AttachmentInput";

export interface AttachmentDropzoneProps {
  children?: SeedAttachmentInput.ContextProps["children"];
}

export const AttachmentDropzone: React.FC<AttachmentDropzoneProps> = ({ children }) => {
  const { triggerProps } = useFileUploadContext();

  return (
    <>
      <SeedAttachmentInput.Dropzone>
        <ActionButton variant="neutralWeak" size="small" layout="withText" {...triggerProps}>
          <PrefixIcon svg={<IconArrowUpBracketDownFill />} />
          {LABEL_SELECT_FILE}
        </ActionButton>
        <SeedAttachmentInput.DropzoneLabel>{LABEL_DROP_FILE}</SeedAttachmentInput.DropzoneLabel>
      </SeedAttachmentInput.Dropzone>
      <SeedAttachmentInput.Container>
        <SeedAttachmentInput.ItemGroup>
          <SeedAttachmentInput.Context>
            {typeof children === "function"
              ? children
              : ({ acceptedFileEntries }) =>
                  acceptedFileEntries.map((fileEntry) => (
                    <AttachmentInputItem key={fileEntry.id} fileEntry={fileEntry} />
                  ))}
          </SeedAttachmentInput.Context>
        </SeedAttachmentInput.ItemGroup>
      </SeedAttachmentInput.Container>
    </>
  );
};
AttachmentDropzone.displayName = "AttachmentDropzone";

export interface AttachmentInputItemProps extends Omit<SeedAttachmentInput.ItemProps, "children"> {
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/react/components/attachment-field
 */
export const AttachmentInputItem = React.forwardRef<HTMLLIElement, AttachmentInputItemProps>(
  ({ onRetry, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();

    return (
      <SeedAttachmentInput.Item ref={ref} {...props}>
        <SeedAttachmentInput.ItemPreview
          image={<SeedAttachmentInput.ItemImage />}
          general={
            <>
              <SeedAttachmentInput.ItemThumbnail fallback={<Icon svg={<IconPaperclipFill />} />} />
              <SeedAttachmentInput.ItemMetadata>
                <SeedAttachmentInput.ItemName />
                <SeedAttachmentInput.ItemSizeText formatBytes={formatBytes} />
              </SeedAttachmentInput.ItemMetadata>
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
              <SeedAttachmentInput.ItemActionButton onClick={onRetry}>
                <Icon svg={<IconArrowClockwiseCircularFill />} />
                {LABEL_RETRY}
              </SeedAttachmentInput.ItemActionButton>
            ),
          }}
        />
        <SeedAttachmentInput.ItemRemoveButton aria-label={LABEL_REMOVE_FILE}>
          <Icon svg={<IconXmarkFill />} />
        </SeedAttachmentInput.ItemRemoveButton>
      </SeedAttachmentInput.Item>
    );
  },
);
AttachmentInputItem.displayName = "AttachmentInputItem";
