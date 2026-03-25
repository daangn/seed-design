"use client";

import * as React from "react";
import { AttachmentDisplay as SeedAttachmentDisplay, Icon } from "@seed-design/react";
import {
  IconCameraFill,
  IconArrowClockwiseCircularFill,
  IconXmarkFill,
} from "@karrotmarket/react-monochrome-icon";

import { ProgressCircle } from "./progress-circle";

// You may implement your own i18n for these labels
const LABEL_ADD_MEDIA = "사진 추가";
const LABEL_RETRY = "재시도";
const LABEL_REMOVE = "삭제";

export interface AttachmentDisplayFieldProps
  extends Omit<SeedAttachmentDisplay.RootProps, "asChild"> {}

/**
 * @see https://seed-design.io/react/components/attachment-display
 */
export const AttachmentDisplayField = React.forwardRef<HTMLDivElement, AttachmentDisplayFieldProps>(
  (props, ref) => {
    return <SeedAttachmentDisplay.Root ref={ref} {...props} />;
  },
);
AttachmentDisplayField.displayName = "AttachmentDisplayField";

export interface AttachmentDisplayInputProps {
  children?: SeedAttachmentDisplay.ContextProps["children"];
}

export const AttachmentDisplayInput = React.forwardRef<HTMLDivElement, AttachmentDisplayInputProps>(
  ({ children }, ref) => {
    return (
      <SeedAttachmentDisplay.Container ref={ref}>
        <SeedAttachmentDisplay.Trigger aria-label={LABEL_ADD_MEDIA}>
          <SeedAttachmentDisplay.TriggerIcon icon={<IconCameraFill />} />
          <SeedAttachmentDisplay.TriggerItemCount />
        </SeedAttachmentDisplay.Trigger>
        <SeedAttachmentDisplay.ItemGroup>
          <SeedAttachmentDisplay.Context>
            {typeof children === "function"
              ? children
              : ({ items }) =>
                  items.map((entry) => <AttachmentDisplayItem key={entry.id} entry={entry} />)}
          </SeedAttachmentDisplay.Context>
        </SeedAttachmentDisplay.ItemGroup>
      </SeedAttachmentDisplay.Container>
    );
  },
);
AttachmentDisplayInput.displayName = "AttachmentDisplayInput";

export interface AttachmentDisplayItemProps
  extends Omit<SeedAttachmentDisplay.ItemProps, "children"> {
  onRetry?: () => void;
}

/**
 * @see https://seed-design.io/react/components/attachment-display
 */
export const AttachmentDisplayItem = React.forwardRef<HTMLLIElement, AttachmentDisplayItemProps>(
  ({ onRetry, ...props }, ref) => {
    return (
      <SeedAttachmentDisplay.Item ref={ref} {...props}>
        <SeedAttachmentDisplay.ItemPreview
          image={<SeedAttachmentDisplay.ItemImage />}
          overlay={{
            uploading: ({ progress }) => (
              <ProgressCircle size="24" value={progress} tone="staticWhite" />
            ),
            error: (
              <SeedAttachmentDisplay.ItemActionButton onClick={onRetry}>
                <Icon svg={<IconArrowClockwiseCircularFill />} />
                {LABEL_RETRY}
              </SeedAttachmentDisplay.ItemActionButton>
            ),
          }}
        />
        <SeedAttachmentDisplay.ItemRemoveButton aria-label={LABEL_REMOVE}>
          <Icon svg={<IconXmarkFill />} />
        </SeedAttachmentDisplay.ItemRemoveButton>
      </SeedAttachmentDisplay.Item>
    );
  },
);
AttachmentDisplayItem.displayName = "AttachmentDisplayItem";
