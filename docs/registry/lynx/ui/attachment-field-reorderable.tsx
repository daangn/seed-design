import * as React from "@lynx-js/react";
import { AttachmentInput as SeedAttachmentInput } from "@seed-design/lynx-react";
import IconCameraFill from "@karrotmarket/lynx-monochrome-icon/IconCameraFill";
import IconPaperclipFill from "@karrotmarket/lynx-monochrome-icon/IconPaperclipFill";
import {
  AttachmentInputItem,
  type AttachmentInputItemProps,
  type AttachmentInputProps,
} from "./attachment-field";
import { HorizontalReorderItem, HorizontalReorderList } from "../lib/attachment-sortable";
type AttachmentInputContext = React.ComponentProps<typeof SeedAttachmentInput.Context>;
let nextAttachmentReorderId = 0;
export type AttachmentInputReorderableProps = {
  id?: string;
  scrollEdgeOffset?: number;
  onDragStateChange?: (dragging: boolean) => void;
} & (
  | { children: AttachmentInputContext["children"]; onRetry?: never }
  | { children?: undefined; onRetry?: AttachmentInputProps["onRetry"] }
);

/**
 * Horizontal native long-press reorder for AttachmentInput.
 *
 * The gesture only emits a reorder intent; AttachmentInput remains the source
 * of truth for entries and applies disabled/readOnly guards.
 *
 * @see https://seed-design.io/lynx/components/attachment-field
 */
export const AttachmentInputReorderable = React.forwardRef<
  React.ComponentRef<typeof SeedAttachmentInput.Container>,
  AttachmentInputReorderableProps
>(({ children, onRetry, id, scrollEdgeOffset, onDragStateChange }, ref) => {
  const [generatedId] = React.useState(() => `instance-${nextAttachmentReorderId++}`);
  const boundaryId = id ? `${id}-container` : `attachment-input-reorder-container-${generatedId}`;
  const reorderId = id ? `${id}-list` : `attachment-input-reorder-list-${generatedId}`;

  return (
    <SeedAttachmentInput.Context>
      {(context) => {
        const { acceptedFileEntries, reorderFileEntry, disabled, readOnly, updateFileEntryStatus } =
          context;
        return (
          <HorizontalReorderList
            items={acceptedFileEntries}
            getItemKey={(entry) => entry.id}
            disabled={disabled}
            readOnly={readOnly}
            id={reorderId}
            scrollableBoundaryId={boundaryId}
            scrollEdgeOffset={scrollEdgeOffset}
            onReorder={reorderFileEntry}
            onDragStateChange={onDragStateChange}
          >
            {({ onScroll, dragging }) => (
              <SeedAttachmentInput.Container
                ref={ref}
                id={boundaryId}
                enable-scroll={!dragging}
                main-thread:bindscroll={onScroll}
              >
                <SeedAttachmentInput.Trigger accessibility-label="파일 선택">
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
                      : ({ acceptedFileEntries: entries }) =>
                          entries.map((fileEntry, index) => (
                            <SortableAttachmentInputItem
                              key={fileEntry.id}
                              fileEntry={fileEntry}
                              index={index}
                              {...(onRetry
                                ? {
                                    onRetry: () => onRetry(fileEntry, { updateFileEntryStatus }),
                                  }
                                : {})}
                            />
                          ))}
                  </SeedAttachmentInput.Context>
                </SeedAttachmentInput.ItemGroup>
              </SeedAttachmentInput.Container>
            )}
          </HorizontalReorderList>
        );
      }}
    </SeedAttachmentInput.Context>
  );
});
AttachmentInputReorderable.displayName = "AttachmentInputReorderable";

export type SortableAttachmentInputItemProps = AttachmentInputItemProps & {
  index: number;
  children?: (dragging: boolean) => React.ReactNode;
};

export const SortableAttachmentInputItem = React.forwardRef<
  React.ComponentRef<typeof AttachmentInputItem>,
  SortableAttachmentInputItemProps
>(({ index, fileEntry, children, ...props }, ref) => (
  <HorizontalReorderItem itemId={fileEntry.id} index={index}>
    {(dragging) =>
      children ? (
        children(dragging)
      ) : (
        <AttachmentInputItem ref={ref} fileEntry={fileEntry} dragging={dragging} {...props} />
      )
    }
  </HorizontalReorderItem>
));
SortableAttachmentInputItem.displayName = "SortableAttachmentInputItem";
