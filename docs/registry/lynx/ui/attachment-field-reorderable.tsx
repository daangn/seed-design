import * as React from "@lynx-js/react";
import {
  AttachmentInput as SeedAttachmentInput,
  useAttachmentInputContext,
} from "@seed-design/lynx-react";
import { Sortable } from "@seed-design/lynx-react-sortable";
import IconCameraFill from "@karrotmarket/lynx-monochrome-icon/IconCameraFill";
import IconPaperclipFill from "@karrotmarket/lynx-monochrome-icon/IconPaperclipFill";
import {
  AttachmentInputItem,
  type AttachmentInputItemProps,
  type AttachmentInputProps,
} from "./attachment-field";

const LABEL_REMOVE_FILE = "파일 제거";
const LABEL_RETRY = "재시도";
const MOVE_ACTION_LABELS = { previous: "앞으로 이동", next: "뒤로 이동" };
const STATUS_LABELS: Partial<Record<AttachmentInputItemProps["fileEntry"]["status"], string>> = {
  uploading: "업로드 중",
  error: "업로드 실패",
};

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
  const globalProps = React.useGlobalProps() as { motion?: unknown } | undefined;

  return (
    <SeedAttachmentInput.Context>
      {(context) => {
        const { acceptedFileEntries, reorderFileEntry, disabled, readOnly, updateFileEntryStatus } =
          context;
        return (
          <Sortable.Root
            items={acceptedFileEntries}
            getItemKey={(entry) => entry.id}
            disabled={disabled}
            readOnly={readOnly}
            id={reorderId}
            scrollableBoundaryId={boundaryId}
            scrollEdgeOffset={scrollEdgeOffset}
            reducedMotion={globalProps?.motion === "reduced"}
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
          </Sortable.Root>
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

/**
 * The whole item is one accessibility element. Screen readers move it with the
 * "앞으로 이동"·"뒤로 이동" actions and reach remove·retry as actions, because iOS
 * does not focus buttons inside an accessibility element.
 */
export const SortableAttachmentInputItem = React.forwardRef<
  React.ComponentRef<typeof AttachmentInputItem>,
  SortableAttachmentInputItemProps
>(({ index, fileEntry, onRetry, children, ...props }, ref) => {
  const { readOnly, removeFileEntry } = useAttachmentInputContext();
  const actions = [
    ...(readOnly ? [] : [LABEL_REMOVE_FILE]),
    ...(onRetry && fileEntry.status === "error" ? [LABEL_RETRY] : []),
  ];
  return (
    <Sortable.Item
      itemId={fileEntry.id}
      index={index}
      accessibility-element={true}
      accessibility-label={fileEntry.file.name}
      accessibility-value={[`${index + 1}번째`, STATUS_LABELS[fileEntry.status]]
        .filter(Boolean)
        .join(", ")}
      moveActionLabels={MOVE_ACTION_LABELS}
      accessibility-actions={actions.length > 0 ? actions : undefined}
      bindaccessibilityaction={(event) => {
        if (event.detail.name === LABEL_REMOVE_FILE) removeFileEntry(fileEntry.id);
        else if (event.detail.name === LABEL_RETRY) onRetry?.();
      }}
    >
      {(dragging) =>
        children ? (
          children(dragging)
        ) : (
          <AttachmentInputItem
            ref={ref}
            fileEntry={fileEntry}
            dragging={dragging}
            onRetry={onRetry}
            {...props}
          />
        )
      }
    </Sortable.Item>
  );
});
SortableAttachmentInputItem.displayName = "SortableAttachmentInputItem";
