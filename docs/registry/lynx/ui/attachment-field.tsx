import * as React from "@lynx-js/react";
import IconArrowClockwiseCircularFill from "@karrotmarket/lynx-monochrome-icon/IconArrowClockwiseCircularFill";
import IconCameraFill from "@karrotmarket/lynx-monochrome-icon/IconCameraFill";
import IconExclamationmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkCircleFill";
import IconPaperclipFill from "@karrotmarket/lynx-monochrome-icon/IconPaperclipFill";
import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import {
  AttachmentInput as SeedAttachmentInput,
  Field as SeedField,
  Icon,
  PrefixIcon,
  HStack,
  useAttachmentInputContext,
} from "@seed-design/lynx-react";
import { ProgressCircle } from "./progress-circle";
import type {
  AttachmentFileEntry,
  AttachmentFileStatusDetails,
  AttachmentInputRootProps,
  NativeFile,
} from "@seed-design/lynx-react";

const LABEL_SELECT_FILE = "파일 선택";
const LABEL_RETRY = "재시도";
const LABEL_REMOVE_FILE = "파일 제거";

type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;
type FileEntry = AttachmentFileEntry;
type AttachmentInputContext = React.ComponentProps<typeof SeedAttachmentInput.Context>;
type RetryHelpers = {
  updateFileEntryStatus: (id: string, details: AttachmentFileStatusDetails) => void;
};

export interface AttachmentFieldProps extends Omit<AttachmentInputRootProps, "children"> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
}

/**
 * @see https://seed-design.io/lynx/components/attachment-field
 */
export const AttachmentField = React.forwardRef<FieldRootRef, AttachmentFieldProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,
      children,
      disabled,
      required,
      invalid,
      readOnly,
      ...props
    },
    ref,
  ) => {
    const renderHeader = label != null || indicator != null;
    const renderErrorMessage = errorMessage != null && invalid;
    const renderDescription = description != null && !renderErrorMessage;
    const renderFooter = renderDescription || renderErrorMessage;

    return (
      <SeedField.Root
        ref={ref}
        disabled={disabled}
        required={required}
        invalid={invalid}
        readOnly={readOnly}
      >
        {renderHeader ? (
          <SeedField.Header>
            <SeedField.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator ? <SeedField.RequiredIndicator /> : null}
              {indicator != null ? (
                <SeedField.IndicatorText>{indicator}</SeedField.IndicatorText>
              ) : null}
            </SeedField.Label>
          </SeedField.Header>
        ) : null}
        <SeedAttachmentInput.Root
          {...props}
          disabled={disabled}
          required={required}
          invalid={invalid}
          readOnly={readOnly}
        >
          {children}
        </SeedAttachmentInput.Root>
        {renderFooter ? (
          <SeedField.Footer>
            {renderDescription ? (
              <SeedField.Description>{description}</SeedField.Description>
            ) : null}
            {renderErrorMessage ? (
              <HStack gap="x1_5" align="flex-start" width="100%">
                <HStack height="var(--seed-line-height-t4)" align="center" shrink={0}>
                  <PrefixIcon
                    icon={<IconExclamationmarkCircleFill />}
                    size="x4"
                    color="fg.critical"
                  />
                </HStack>
                <SeedField.ErrorMessage style={{ flexShrink: 1 }}>
                  {errorMessage}
                </SeedField.ErrorMessage>
              </HStack>
            ) : null}
          </SeedField.Footer>
        ) : null}
      </SeedField.Root>
    );
  },
);
AttachmentField.displayName = "AttachmentField";

export type AttachmentInputProps =
  | { children: AttachmentInputContext["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (fileEntry: FileEntry, helpers: RetryHelpers) => void;
    };

/**
 * @see https://seed-design.io/lynx/components/attachment-field
 */
export const AttachmentInput = React.forwardRef<
  React.ComponentRef<typeof SeedAttachmentInput.Container>,
  AttachmentInputProps
>(({ children, onRetry }, ref) => {
  return (
    <SeedAttachmentInput.Container ref={ref}>
      <SeedAttachmentInput.Trigger accessibility-label={LABEL_SELECT_FILE}>
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
            : ({ acceptedFileEntries, updateFileEntryStatus }) =>
                acceptedFileEntries.map((fileEntry) => (
                  <AttachmentInputItem
                    key={fileEntry.id}
                    fileEntry={fileEntry}
                    {...(onRetry
                      ? { onRetry: () => onRetry(fileEntry, { updateFileEntryStatus }) }
                      : {})}
                  />
                ))}
        </SeedAttachmentInput.Context>
      </SeedAttachmentInput.ItemGroup>
    </SeedAttachmentInput.Container>
  );
});
AttachmentInput.displayName = "AttachmentInput";

type AttachmentInputItemNativeProps = Omit<
  React.ComponentProps<typeof SeedAttachmentInput.Item>,
  "children" | "fileEntry"
>;

export interface AttachmentInputItemProps extends AttachmentInputItemNativeProps {
  fileEntry: FileEntry;
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/lynx/components/attachment-field
 */
export const AttachmentInputItem = React.forwardRef<
  React.ComponentRef<typeof SeedAttachmentInput.Item>,
  AttachmentInputItemProps
>(({ fileEntry, onRetry, ...itemProps }, ref) => {
  const { acceptType } = useAttachmentInputContext();
  return (
    <SeedAttachmentInput.Item ref={ref} fileEntry={fileEntry} {...itemProps}>
      <SeedAttachmentInput.ItemSurface>
        <SeedAttachmentInput.ItemImage />
        <SeedAttachmentInput.ItemThumbnail>
          <Icon icon={<IconPaperclipFill />} />
        </SeedAttachmentInput.ItemThumbnail>
        <SeedAttachmentInput.ItemMetadata>
          <SeedAttachmentInput.ItemName />
          <SeedAttachmentInput.ItemSize />
        </SeedAttachmentInput.ItemMetadata>
        <SeedAttachmentInput.ItemBackdrop status="uploading">
          {(entry) => (
            <ProgressCircle
              size="24"
              tone={acceptType === "image" ? "staticWhite" : "neutral"}
              {...("progress" in entry ? { value: entry.progress } : {})}
            />
          )}
        </SeedAttachmentInput.ItemBackdrop>
        {onRetry ? (
          <SeedAttachmentInput.ItemBackdrop status="error">
            <SeedAttachmentInput.ItemActionButton bindtap={onRetry}>
              <Icon icon={<IconArrowClockwiseCircularFill />} />
              {LABEL_RETRY}
            </SeedAttachmentInput.ItemActionButton>
          </SeedAttachmentInput.ItemBackdrop>
        ) : null}
      </SeedAttachmentInput.ItemSurface>
      <SeedAttachmentInput.ItemRemoveButton accessibility-label={LABEL_REMOVE_FILE}>
        <Icon icon={<IconXmarkFill />} />
      </SeedAttachmentInput.ItemRemoveButton>
    </SeedAttachmentInput.Item>
  );
});
AttachmentInputItem.displayName = "AttachmentInputItem";

export type { NativeFile };
