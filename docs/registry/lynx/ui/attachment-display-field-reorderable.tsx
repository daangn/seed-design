import * as React from "@lynx-js/react";
import IconCameraFill from "@karrotmarket/lynx-monochrome-icon/IconCameraFill";
import { AttachmentDisplay as SeedAttachmentDisplay } from "@seed-design/lynx-react";
import {
  AttachmentDisplayItem,
  type AttachmentDisplayItemProps,
  type AttachmentDisplayProps,
} from "./attachment-display-field";
import { HorizontalReorderItem, HorizontalReorderList } from "../lib/attachment-sortable";

const LABEL_SELECT_FILE = "파일 선택";
let nextReorderInstanceId = 0;

type ReorderableContext = Parameters<NonNullable<AttachmentDisplayProps["children"]>>[0];

export type AttachmentDisplayReorderableProps = {
  onTriggerTap: AttachmentDisplayProps["onTriggerTap"];
  id?: string;
  scrollEdgeOffset?: number;
  onDragStateChange?: (dragging: boolean) => void;
} & (
  | { children: NonNullable<AttachmentDisplayProps["children"]>; onRetry?: never }
  | { children?: undefined; onRetry?: AttachmentDisplayProps["onRetry"] }
);

/**
 * Horizontal native long-press reorder for AttachmentDisplay.
 *
 * The gesture only emits a reorder intent; AttachmentDisplay remains the
 * source of truth for entries and applies disabled/readOnly guards.
 *
 * @see https://seed-design.io/lynx/components/attachment-display-field
 */
export const AttachmentDisplayReorderable = React.forwardRef<
  React.ComponentRef<typeof SeedAttachmentDisplay.Container>,
  AttachmentDisplayReorderableProps
>(({ onTriggerTap, children, onRetry, id, scrollEdgeOffset, onDragStateChange }, ref) => {
  const [instanceId] = React.useState(() => nextReorderInstanceId++);
  const boundaryId = id ? `${id}-container` : `attachment-display-reorder-container-${instanceId}`;
  const reorderId = id ? `${id}-list` : `attachment-display-reorder-list-${instanceId}`;

  return (
    <SeedAttachmentDisplay.Context>
      {(context: ReorderableContext) => (
        <HorizontalReorderList
          items={context.entries}
          getItemKey={(entry) => entry.id}
          disabled={context.disabled}
          readOnly={context.readOnly}
          id={reorderId}
          scrollableBoundaryId={boundaryId}
          scrollEdgeOffset={scrollEdgeOffset}
          onReorder={context.reorderEntry}
          onDragStateChange={onDragStateChange}
        >
          {({ onScroll, dragging }) => (
            <SeedAttachmentDisplay.Container
              ref={ref}
              id={boundaryId}
              main-thread:bindscroll={onScroll}
              enable-scroll={!dragging}
            >
              <SeedAttachmentDisplay.Trigger
                bindtap={() => {
                  "background only";
                  onTriggerTap({
                    addEntries: context.addEntries,
                    updateEntryStatus: context.updateEntryStatus,
                  });
                }}
                accessibility-label={LABEL_SELECT_FILE}
              >
                <SeedAttachmentDisplay.TriggerIcon image={<IconCameraFill />} />
                <SeedAttachmentDisplay.TriggerItemCount />
              </SeedAttachmentDisplay.Trigger>
              <SeedAttachmentDisplay.ItemGroup>
                {typeof children === "function"
                  ? children(context)
                  : context.entries.map((entry, index) => (
                      <SortableAttachmentDisplayItem
                        key={entry.id}
                        entry={entry}
                        index={index}
                        {...(onRetry
                          ? {
                              onRetry: () =>
                                onRetry(entry, { updateEntryStatus: context.updateEntryStatus }),
                            }
                          : {})}
                      />
                    ))}
              </SeedAttachmentDisplay.ItemGroup>
            </SeedAttachmentDisplay.Container>
          )}
        </HorizontalReorderList>
      )}
    </SeedAttachmentDisplay.Context>
  );
});
AttachmentDisplayReorderable.displayName = "AttachmentDisplayReorderable";

export type SortableAttachmentDisplayItemProps = AttachmentDisplayItemProps & {
  index: number;
};

export const SortableAttachmentDisplayItem = React.forwardRef<
  React.ComponentRef<typeof AttachmentDisplayItem>,
  SortableAttachmentDisplayItemProps
>(({ index, entry, ...props }, ref) => (
  <HorizontalReorderItem itemId={entry.id} index={index}>
    {(dragging) => <AttachmentDisplayItem ref={ref} entry={entry} {...props} dragging={dragging} />}
  </HorizontalReorderItem>
));
SortableAttachmentDisplayItem.displayName = "SortableAttachmentDisplayItem";
