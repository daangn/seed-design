import {
  IconArrowClockwiseCircularFill,
  IconCameraFill,
  IconExclamationmarkCircleFill,
  IconXmarkFill,
} from "@karrotmarket/react-monochrome-icon";
import type { FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  Icon,
  PrefixIcon,
  VisuallyHidden,
} from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import * as React from "react";

import { ProgressCircle } from "./progress-circle";

// You may implement your own i18n for these labels
const LABEL_SELECT_FILE = "파일 선택";
const LABEL_RETRY = "재시도";
const LABEL_REMOVE = "파일 제거";

export interface AttachmentDisplayFieldProps
  extends Omit<SeedAttachmentDisplay.RootProps, "asChild"> {
  label?: React.ReactNode;
  /**
   * @default "medium"
   */
  labelWeight?: FieldLabelVariantProps["weight"];

  indicator?: React.ReactNode;

  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showRequiredIndicator?: boolean;
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
        <SeedAttachmentDisplay.Control>{children}</SeedAttachmentDisplay.Control>
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
  onTriggerClick: () => void;
} & (
  | { children: SeedAttachmentDisplay.ContextProps["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (entry: DisplayItemEntry) => void;
    }
);

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplay = React.forwardRef<HTMLDivElement, AttachmentDisplayProps>(
  ({ onTriggerClick, children, onRetry }, ref) => {
    return (
      <SeedAttachmentDisplay.Container ref={ref}>
        <SeedAttachmentDisplay.Trigger onClick={onTriggerClick} aria-label={LABEL_SELECT_FILE}>
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
                      {...(onRetry && { onRetry: () => onRetry(entry) })}
                    />
                  ))}
          </SeedAttachmentDisplay.Context>
        </SeedAttachmentDisplay.ItemGroup>
      </SeedAttachmentDisplay.Container>
    );
  },
);
AttachmentDisplay.displayName = "AttachmentDisplay";

export interface AttachmentDisplayItemProps
  extends Omit<SeedAttachmentDisplay.ItemProps, "children"> {
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplayItem = React.forwardRef<HTMLLIElement, AttachmentDisplayItemProps>(
  ({ onRetry, ...props }, ref) => {
    return (
      <SeedAttachmentDisplay.Item ref={ref} {...props}>
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
