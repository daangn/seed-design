import * as React from "@lynx-js/react";
import IconArrowClockwiseCircularFill from "@karrotmarket/lynx-monochrome-icon/IconArrowClockwiseCircularFill";
import IconCameraFill from "@karrotmarket/lynx-monochrome-icon/IconCameraFill";
import IconExclamationmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkCircleFill";
import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  Field as SeedField,
  Icon,
  PrefixIcon,
  HStack,
} from "@seed-design/lynx-react";
import { ProgressCircle } from "./progress-circle";
import type {
  AttachmentDisplayContextProps,
  AttachmentDisplayEntry,
  AttachmentDisplayRootProps,
  AttachmentDisplayStatusDetails,
} from "@seed-design/lynx-react";

const LABEL_SELECT_FILE = "파일 선택";
const LABEL_RETRY = "재시도";
const LABEL_REMOVE = "파일 제거";

type FieldRootRef = React.ComponentRef<typeof SeedField.Root>;
type DisplayEntry = AttachmentDisplayEntry;
type DisplayItemRootProps = React.ComponentProps<typeof SeedAttachmentDisplay.Item>;
type DisplayItemRef = React.ComponentRef<typeof SeedAttachmentDisplay.Item>;
type DisplayRetryHelpers = {
  updateEntryStatus: (id: string, details: AttachmentDisplayStatusDetails) => void;
};
type DisplayContext = Parameters<AttachmentDisplayContextProps["children"]>[0];
type DisplayTriggerHelpers = Pick<DisplayContext, "addEntries" | "updateEntryStatus">;

export type AttachmentDisplayProps = {
  onTriggerTap: (helpers: DisplayTriggerHelpers) => void;
} & (
  | { children: AttachmentDisplayContextProps["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (entry: DisplayEntry, helpers: DisplayRetryHelpers) => void;
    }
);

export interface AttachmentDisplayFieldProps extends Omit<AttachmentDisplayRootProps, "children"> {
  children?: React.ReactNode;
  label?: React.ReactNode;
  labelWeight?: SeedField.LabelProps["weight"];
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
}

/**
 * @see https://seed-design.io/lynx/components/attachment-display-field
 */
export const AttachmentDisplayField = React.forwardRef<FieldRootRef, AttachmentDisplayFieldProps>(
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
        <SeedAttachmentDisplay.Root
          {...props}
          disabled={disabled}
          invalid={invalid}
          readOnly={readOnly}
        >
          <SeedAttachmentDisplay.Control>{children}</SeedAttachmentDisplay.Control>
        </SeedAttachmentDisplay.Root>
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
AttachmentDisplayField.displayName = "AttachmentDisplayField";

/**
 * @see https://seed-design.io/lynx/components/attachment-display-field
 */
export const AttachmentDisplay = React.forwardRef<
  React.ComponentRef<typeof SeedAttachmentDisplay.Container>,
  AttachmentDisplayProps
>(({ onTriggerTap, children, onRetry }, ref) => {
  return (
    <SeedAttachmentDisplay.Context>
      {({ addEntries, updateEntryStatus }) => (
        <SeedAttachmentDisplay.Container ref={ref}>
          <SeedAttachmentDisplay.Trigger
            bindtap={() => {
              "background only";
              onTriggerTap({ addEntries, updateEntryStatus });
            }}
            accessibility-label={LABEL_SELECT_FILE}
          >
            <SeedAttachmentDisplay.TriggerIcon image={<IconCameraFill />} />
            <SeedAttachmentDisplay.TriggerItemCount />
          </SeedAttachmentDisplay.Trigger>
          <SeedAttachmentDisplay.ItemGroup>
            <SeedAttachmentDisplay.Context>
              {typeof children === "function"
                ? children
                : ({ entries, updateEntryStatus: updateStatus }) =>
                    entries.map((entry) => (
                      <AttachmentDisplayItem
                        key={entry.id}
                        entry={entry}
                        {...(onRetry
                          ? { onRetry: () => onRetry(entry, { updateEntryStatus: updateStatus }) }
                          : {})}
                      />
                    ))}
            </SeedAttachmentDisplay.Context>
          </SeedAttachmentDisplay.ItemGroup>
        </SeedAttachmentDisplay.Container>
      )}
    </SeedAttachmentDisplay.Context>
  );
});
AttachmentDisplay.displayName = "AttachmentDisplay";

export interface AttachmentDisplayItemProps extends Omit<DisplayItemRootProps, "entry"> {
  entry: DisplayEntry;
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/lynx/components/attachment-display-field
 */
export const AttachmentDisplayItem = React.forwardRef<DisplayItemRef, AttachmentDisplayItemProps>(
  ({ entry, onRetry, children, ...itemProps }, ref) => {
    return (
      <SeedAttachmentDisplay.Item ref={ref} {...itemProps} entry={entry}>
        {children ?? (
          <>
            <SeedAttachmentDisplay.ItemSurface>
              <SeedAttachmentDisplay.ItemImage />
              <SeedAttachmentDisplay.ItemBackdrop status="uploading">
                {(item) => (
                  <ProgressCircle
                    size="24"
                    tone="staticWhite"
                    {...("progress" in item ? { value: item.progress } : {})}
                  />
                )}
              </SeedAttachmentDisplay.ItemBackdrop>
              {onRetry ? (
                <SeedAttachmentDisplay.ItemBackdrop status="error">
                  <SeedAttachmentDisplay.ItemActionButton bindtap={onRetry}>
                    <Icon icon={<IconArrowClockwiseCircularFill />} />
                    {LABEL_RETRY}
                  </SeedAttachmentDisplay.ItemActionButton>
                </SeedAttachmentDisplay.ItemBackdrop>
              ) : null}
            </SeedAttachmentDisplay.ItemSurface>
            <SeedAttachmentDisplay.ItemRemoveButton accessibility-label={LABEL_REMOVE}>
              <Icon icon={<IconXmarkFill />} />
            </SeedAttachmentDisplay.ItemRemoveButton>
          </>
        )}
      </SeedAttachmentDisplay.Item>
    );
  },
);
AttachmentDisplayItem.displayName = "AttachmentDisplayItem";
