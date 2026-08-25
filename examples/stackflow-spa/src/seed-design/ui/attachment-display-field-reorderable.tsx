import { Accessibility, AutoScroller, KeyboardSensor, PointerSensor } from "@dnd-kit/dom";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { IconCameraFill } from "@karrotmarket/react-monochrome-icon";
import { AttachmentDisplay as SeedAttachmentDisplay } from "@seed-design/react";
import {
  type DisplayItemEntry,
  type UseAttachmentDisplayReturn,
  useAttachmentDisplayContext,
} from "@seed-design/react/primitive";
import * as React from "react";

import { AttachmentDisplayItem, type AttachmentDisplayItemProps } from "./attachment-display-field";
import { useAttachmentItemReorder } from "../lib/attachment-reorder";

const LABEL_SELECT_FILE = "파일 선택";

const autoScrollerPlugin = AutoScroller.configure({ threshold: { x: 0.2, y: 0 } });

const sensors = [
  PointerSensor.configure({
    // The item remains the pointer/touch target while the handle owns keyboard and ARIA behavior.
    activatorElements(source) {
      return [source.element, source.handle];
    },
  }),
  KeyboardSensor,
];

const accessibilityPlugin = Accessibility.configure({
  screenReaderInstructions: {
    draggable:
      "항목을 집어 항목 순서 변경을 시작하려면 스페이스 바를 누르세요. 방향키를 사용하여 순서를 변경한 뒤 스페이스 바를 다시 눌러 순서 변경을 종료하거나 Esc 키로 순서 변경을 취소할 수 있어요.",
  },
  announcements: {
    dragstart: ({ operation: { source } }) => {
      if (!source) return;

      return `${source.data.name} 항목 순서 변경을 시작했어요.`;
    },
    dragend: ({ operation: { source }, canceled }) => {
      if (!source || !isSortable(source)) return;

      if (canceled) return `${source.data.name} 항목 순서 변경을 취소했어요.`;

      return `${source.data.name} 항목을 ${source.sortable.index + 1}번째에 놓았어요.`;
    },
  },
} satisfies NonNullable<ConstructorParameters<typeof Accessibility>[1]>);

export type AttachmentDisplayReorderableProps = {
  onTriggerClick: (
    helpers: Pick<UseAttachmentDisplayReturn, "addEntries" | "updateEntryStatus">,
  ) => void;
} & (
  | { children: SeedAttachmentDisplay.ContextProps["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (
        entry: DisplayItemEntry,
        helpers: Pick<UseAttachmentDisplayReturn, "updateEntryStatus">,
      ) => void;
    }
);

/**
 * @see https://seed-design.io/react/components/attachment-display-field
 */
export const AttachmentDisplayReorderable = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayReorderableProps
>(function AttachmentDisplayReorderable({ onTriggerClick, onRetry, children }, ref) {
  const { addEntries, reorderEntry, updateEntryStatus } = useAttachmentDisplayContext();

  return (
    <DragDropProvider
      plugins={(defaults) => [...defaults, autoScrollerPlugin, accessibilityPlugin]}
      sensors={sensors}
      onDragEnd={({ canceled, operation: { source } }) => {
        if (canceled) return;
        if (!isSortable(source)) return;

        reorderEntry(source.sortable.initialIndex, source.sortable.index);
      }}
    >
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
                  entries.map((entry, index) => (
                    <SortableAttachmentDisplayItem
                      key={entry.id}
                      entry={entry}
                      index={index}
                      {...(onRetry && { onRetry: () => onRetry(entry, { updateEntryStatus }) })}
                    />
                  ))}
          </SeedAttachmentDisplay.Context>
        </SeedAttachmentDisplay.ItemGroup>
      </SeedAttachmentDisplay.Container>
    </DragDropProvider>
  );
});
AttachmentDisplayReorderable.displayName = "AttachmentDisplayReorderable";

interface SortableAttachmentDisplayItemProps extends AttachmentDisplayItemProps {
  index: number;
  fileName?: string;
}

export const SortableAttachmentDisplayItem = React.forwardRef<
  HTMLLIElement,
  SortableAttachmentDisplayItemProps
>(({ entry, index, fileName, ...props }, forwardedRef) => {
  const { readOnly } = useAttachmentDisplayContext();
  const itemName = fileName ?? `${index + 1}번째 이미지`;
  const { itemRef, itemProps } = useAttachmentItemReorder({
    id: entry.id,
    index,
    name: itemName,
    label: props["aria-label"] ?? `${itemName} 순서 변경`,
    disabled: readOnly,
    forwardedRef,
  });

  return <AttachmentDisplayItem ref={itemRef} entry={entry} {...props} {...itemProps} />;
});
SortableAttachmentDisplayItem.displayName = "SortableAttachmentDisplayItem";
