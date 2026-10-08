import * as React from "@lynx-js/react";
import IconCameraFill from "@karrotmarket/lynx-monochrome-icon/IconCameraFill";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  useAttachmentDisplayContext,
} from "@seed-design/lynx-react";
import { Sortable } from "@seed-design/lynx-react-sortable";
import {
  AttachmentDisplayItem,
  type AttachmentDisplayItemProps,
  type AttachmentDisplayProps,
} from "./attachment-display-field";

const LABEL_SELECT_FILE = "파일 선택";
const LABEL_REMOVE = "파일 제거";
const LABEL_RETRY = "재시도";
const LABEL_ITEM = "이미지";
const MOVE_ACTION_LABELS = { previous: "앞으로 이동", next: "뒤로 이동" };
const STATUS_LABELS: Partial<Record<AttachmentDisplayItemProps["entry"]["status"], string>> = {
  uploading: "업로드 중",
  error: "업로드 실패",
};
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
  const globalProps = React.useGlobalProps() as { motion?: unknown } | undefined;

  return (
    <SeedAttachmentDisplay.Context>
      {(context: ReorderableContext) => (
        <Sortable.Root
          items={context.entries}
          getItemKey={(entry) => entry.id}
          disabled={context.disabled}
          readOnly={context.readOnly}
          id={reorderId}
          scrollableBoundaryId={boundaryId}
          scrollEdgeOffset={scrollEdgeOffset}
          reducedMotion={globalProps?.motion === "reduced"}
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
        </Sortable.Root>
      )}
    </SeedAttachmentDisplay.Context>
  );
});
AttachmentDisplayReorderable.displayName = "AttachmentDisplayReorderable";

export type SortableAttachmentDisplayItemProps = AttachmentDisplayItemProps & {
  index: number;
};

/**
 * The whole item is one accessibility element. Screen readers move it with the
 * "앞으로 이동"·"뒤로 이동" actions and reach remove·retry as actions, because iOS
 * does not focus buttons inside an accessibility element.
 */
export const SortableAttachmentDisplayItem = React.forwardRef<
  React.ComponentRef<typeof AttachmentDisplayItem>,
  SortableAttachmentDisplayItemProps
>(({ index, entry, onRetry, ...props }, ref) => {
  const { readOnly, removeEntry } = useAttachmentDisplayContext();
  const actions = [
    ...(readOnly ? [] : [LABEL_REMOVE]),
    ...(onRetry && entry.status === "error" ? [LABEL_RETRY] : []),
  ];
  return (
    <Sortable.Item
      itemId={entry.id}
      index={index}
      accessibility-element={true}
      accessibility-label={entry.name ?? LABEL_ITEM}
      accessibility-value={[`${index + 1}번째`, STATUS_LABELS[entry.status]]
        .filter(Boolean)
        .join(", ")}
      moveActionLabels={MOVE_ACTION_LABELS}
      accessibility-actions={actions.length > 0 ? actions : undefined}
      bindaccessibilityaction={(event) => {
        if (event.detail.name === LABEL_REMOVE) removeEntry(entry.id);
        else if (event.detail.name === LABEL_RETRY) onRetry?.();
      }}
    >
      {(dragging) => (
        <AttachmentDisplayItem
          ref={ref}
          entry={entry}
          onRetry={onRetry}
          {...props}
          dragging={dragging}
        />
      )}
    </Sortable.Item>
  );
});
SortableAttachmentDisplayItem.displayName = "SortableAttachmentDisplayItem";
