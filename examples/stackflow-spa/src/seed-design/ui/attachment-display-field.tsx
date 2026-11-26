import {
  IconArrowClockwiseCircularFill,
  IconCameraFill,
  IconExclamationmarkCircleFill,
  IconXmarkFill,
} from "@karrotmarket/react-monochrome-icon";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  Icon,
  PrefixIcon,
  VisuallyHidden,
  type AttachmentDisplayItemEntry,
  useAttachmentDisplayContext,
  type AttachmentDisplayContextValue,
} from "@seed-design/react";
import * as React from "react";

import { ProgressCircle } from "./progress-circle";
import { formatDuration, formatDurationLabel } from "../lib/format-duration";

// You may implement your own i18n for these labels
const LABEL_SELECT_FILE = "파일 선택";
const LABEL_RETRY = "재시도";
const LABEL_REMOVE = "파일 제거";
const LABEL_DURATION = "재생시간";

export interface AttachmentDisplayFieldProps extends Omit<
  SeedAttachmentDisplay.RootProps,
  "asChild"
> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: SeedAttachmentDisplay.LabelProps["weight"];

  indicator?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;

  controlProps?: Omit<SeedAttachmentDisplay.ControlProps, "children" | "asChild">;
}

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplayField = React.forwardRef<HTMLDivElement, AttachmentDisplayFieldProps>(
  (
    {
      label,
      labelWeight,
      indicator,
      description,
      errorMessage,
      showRequiredIndicator,
      controlProps,
      children,
      ...props
    },
    ref,
  ) => {
    const renderHeader = label || indicator;
    const renderDescription = !!description;
    const renderErrorMessage = errorMessage && props.invalid;
    const renderFooter = renderDescription || renderErrorMessage;

    return (
      <SeedAttachmentDisplay.Root ref={ref} {...props}>
        {renderHeader && (
          <SeedAttachmentDisplay.Header>
            <SeedAttachmentDisplay.Label weight={labelWeight}>
              {label}
              {showRequiredIndicator && <SeedAttachmentDisplay.RequiredIndicator />}
              {indicator && (
                <SeedAttachmentDisplay.IndicatorText>
                  {indicator}
                </SeedAttachmentDisplay.IndicatorText>
              )}
            </SeedAttachmentDisplay.Label>
            {/* You might want to put your custom element here */}
          </SeedAttachmentDisplay.Header>
        )}
        <SeedAttachmentDisplay.Control {...controlProps}>{children}</SeedAttachmentDisplay.Control>
        {renderFooter && (
          <SeedAttachmentDisplay.Footer>
            {renderDescription &&
              (renderErrorMessage ? (
                <VisuallyHidden asChild>
                  <SeedAttachmentDisplay.Description>
                    {description}
                  </SeedAttachmentDisplay.Description>
                </VisuallyHidden>
              ) : (
                <SeedAttachmentDisplay.Description>{description}</SeedAttachmentDisplay.Description>
              ))}
            {renderErrorMessage && (
              <SeedAttachmentDisplay.ErrorMessage>
                <PrefixIcon svg={<IconExclamationmarkCircleFill />} />
                {errorMessage}
              </SeedAttachmentDisplay.ErrorMessage>
            )}
          </SeedAttachmentDisplay.Footer>
        )}
      </SeedAttachmentDisplay.Root>
    );
  },
);
AttachmentDisplayField.displayName = "AttachmentDisplayField";

export type AttachmentDisplayProps = {
  onTriggerClick: (
    helpers: Pick<AttachmentDisplayContextValue, "addEntries" | "updateEntryStatus">,
  ) => void;
} & (
  | { children: SeedAttachmentDisplay.ContextProps["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (
        entry: AttachmentDisplayItemEntry,
        helpers: Pick<AttachmentDisplayContextValue, "updateEntryStatus">,
      ) => void;
    }
);

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplay = React.forwardRef<HTMLDivElement, AttachmentDisplayProps>(
  ({ onTriggerClick, children, onRetry }, ref) => {
    const { addEntries, updateEntryStatus } = useAttachmentDisplayContext();

    return (
      <SeedAttachmentDisplay.Container ref={ref}>
        <SeedAttachmentDisplay.Trigger
          onClick={() => onTriggerClick({ addEntries, updateEntryStatus })}
          aria-label={LABEL_SELECT_FILE}
        >
          <SeedAttachmentDisplay.TriggerIcon image={<IconCameraFill />} />
          <SeedAttachmentDisplay.TriggerItemCount />
        </SeedAttachmentDisplay.Trigger>
        <SeedAttachmentDisplay.ItemGroup>
          <SeedAttachmentDisplay.Context>
            {typeof children === "function"
              ? children
              : ({ entries }) =>
                  entries.map((entry) => (
                    <AttachmentDisplayItem
                      key={entry.id}
                      entry={entry}
                      {...(onRetry && { onRetry: () => onRetry(entry, { updateEntryStatus }) })}
                    />
                  ))}
          </SeedAttachmentDisplay.Context>
        </SeedAttachmentDisplay.ItemGroup>
      </SeedAttachmentDisplay.Container>
    );
  },
);
AttachmentDisplay.displayName = "AttachmentDisplay";

export interface AttachmentDisplayItemProps extends Omit<
  SeedAttachmentDisplay.ItemProps,
  "children" | "asChild"
> {
  onRetry?: () => void;
  /**
   * Rendered before the item contents. Pass an `AttachmentDisplay.ItemReorderHandle` to make the item reorderable.
   */
  reorderHandle?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplayItem = React.forwardRef<HTMLLIElement, AttachmentDisplayItemProps>(
  ({ onRetry, reorderHandle, ...props }, ref) => {
    return (
      <SeedAttachmentDisplay.Item ref={ref} {...props}>
        {reorderHandle}
        <SeedAttachmentDisplay.ItemImage />
        <SeedAttachmentDisplay.ItemBackdrop status="uploading">
          {(entry) => (
            <ProgressCircle
              size="24"
              tone="staticWhite"
              {...("progress" in entry && { value: entry.progress })}
            />
          )}
        </SeedAttachmentDisplay.ItemBackdrop>
        {onRetry && (
          <SeedAttachmentDisplay.ItemBackdrop status="error">
            <SeedAttachmentDisplay.ItemActionButton onClick={onRetry}>
              <Icon svg={<IconArrowClockwiseCircularFill />} />
              {LABEL_RETRY}
            </SeedAttachmentDisplay.ItemActionButton>
          </SeedAttachmentDisplay.ItemBackdrop>
        )}
        <SeedAttachmentDisplay.ItemRemoveButton aria-label={LABEL_REMOVE}>
          <Icon svg={<IconXmarkFill />} />
        </SeedAttachmentDisplay.ItemRemoveButton>
      </SeedAttachmentDisplay.Item>
    );
  },
);
AttachmentDisplayItem.displayName = "AttachmentDisplayItem";

export interface AttachmentDisplayItemDurationBadgeProps extends Omit<
  SeedAttachmentDisplay.ItemDurationBadgeProps,
  "children" | "asChild"
> {
  /**
   * The video's duration in seconds. Shown as `m:ss` below an hour and `h:mm:ss` from an hour
   * on, and read by screen readers as a phrase such as "재생시간 1분 5초".
   */
  seconds: number;
}

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplayItemDurationBadge = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemDurationBadgeProps
>(({ seconds, ...props }, ref) => {
  return (
    <SeedAttachmentDisplay.ItemDurationBadge
      ref={ref}
      role="img"
      aria-label={`${LABEL_DURATION} ${formatDurationLabel(seconds)}`}
      {...props}
    >
      {formatDuration(seconds)}
    </SeedAttachmentDisplay.ItemDurationBadge>
  );
});
AttachmentDisplayItemDurationBadge.displayName = "AttachmentDisplayItemDurationBadge";
