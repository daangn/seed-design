"use client";

import { Accessibility, AutoScroller, KeyboardSensor, PointerSensor } from "@dnd-kit/dom";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import * as React from "react";
import { AttachmentInput as SeedAttachmentInput, PrefixIcon } from "@seed-design/react";
import {
  useFileUploadContext,
  type FileEntry,
  type UseFileUploadReturn,
} from "@seed-design/react/primitive";
import {
  IconCameraFill,
  IconPaperclipFill,
  IconArrowUpBracketDownFill,
} from "@karrotmarket/react-monochrome-icon";

import { ActionButton } from "./action-button";
import { AttachmentInputItem, type AttachmentInputItemProps } from "./attachment-field";
import { useAttachmentItemReorder } from "../lib/attachment-reorder";

const LABEL_SELECT_FILE = "파일 선택";
const LABEL_DROP_FILE = "또는 여기로 드래그해서 업로드";

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

export type AttachmentInputReorderableProps =
  | { children: SeedAttachmentInput.ContextProps["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (
        fileEntry: FileEntry,
        helpers: Pick<UseFileUploadReturn, "updateFileEntryStatus">,
      ) => void;
    };

export const AttachmentInputReorderable = React.forwardRef<
  HTMLDivElement,
  AttachmentInputReorderableProps
>(({ children, onRetry }, ref) => {
  const { reorderFileEntry } = useFileUploadContext();

  return (
    <DragDropProvider
      plugins={(defaults) => [...defaults, autoScrollerPlugin, accessibilityPlugin]}
      sensors={sensors}
      onDragEnd={({ canceled, operation: { source } }) => {
        if (canceled) return;
        if (!isSortable(source)) return;

        reorderFileEntry(source.sortable.initialIndex, source.sortable.index);
      }}
    >
      <SeedAttachmentInput.Container ref={ref}>
        <SeedAttachmentInput.Trigger aria-label={LABEL_SELECT_FILE}>
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
                  acceptedFileEntries.map((fileEntry, index) => (
                    <SortableAttachmentInputItem
                      key={fileEntry.id}
                      fileEntry={fileEntry}
                      index={index}
                      {...(onRetry && {
                        onRetry: () => onRetry(fileEntry, { updateFileEntryStatus }),
                      })}
                    />
                  ))}
          </SeedAttachmentInput.Context>
        </SeedAttachmentInput.ItemGroup>
      </SeedAttachmentInput.Container>
    </DragDropProvider>
  );
});
AttachmentInputReorderable.displayName = "AttachmentInputReorderable";

export type AttachmentDropzoneReorderableProps =
  | { children: SeedAttachmentInput.ContextProps["children"]; onRetry?: never }
  | {
      children?: undefined;
      onRetry?: (
        fileEntry: FileEntry,
        helpers: Pick<UseFileUploadReturn, "updateFileEntryStatus">,
      ) => void;
    };

export const AttachmentDropzoneReorderable: React.FC<AttachmentDropzoneReorderableProps> = ({
  children,
  onRetry,
}) => {
  const { triggerProps, reorderFileEntry } = useFileUploadContext();

  return (
    <>
      <SeedAttachmentInput.Dropzone>
        <ActionButton variant="neutralWeak" size="small" layout="withText" {...triggerProps}>
          <PrefixIcon svg={<IconArrowUpBracketDownFill />} />
          {LABEL_SELECT_FILE}
        </ActionButton>
        <SeedAttachmentInput.DropzoneLabel>{LABEL_DROP_FILE}</SeedAttachmentInput.DropzoneLabel>
      </SeedAttachmentInput.Dropzone>
      <DragDropProvider
        plugins={(defaults) => [...defaults, autoScrollerPlugin, accessibilityPlugin]}
        sensors={sensors}
        onDragEnd={({ canceled, operation: { source } }) => {
          if (canceled) return;
          if (!isSortable(source)) return;

          reorderFileEntry(source.sortable.initialIndex, source.sortable.index);
        }}
      >
        <SeedAttachmentInput.Container>
          <SeedAttachmentInput.ItemGroup>
            <SeedAttachmentInput.Context>
              {typeof children === "function"
                ? children
                : ({ acceptedFileEntries, updateFileEntryStatus }) =>
                    acceptedFileEntries.map((fileEntry, index) => (
                      <SortableAttachmentInputItem
                        key={fileEntry.id}
                        fileEntry={fileEntry}
                        index={index}
                        {...(onRetry && {
                          onRetry: () => onRetry(fileEntry, { updateFileEntryStatus }),
                        })}
                      />
                    ))}
            </SeedAttachmentInput.Context>
          </SeedAttachmentInput.ItemGroup>
        </SeedAttachmentInput.Container>
      </DragDropProvider>
    </>
  );
};
AttachmentDropzoneReorderable.displayName = "AttachmentDropzoneReorderable";

interface SortableAttachmentInputItemProps extends AttachmentInputItemProps {
  index: number;
}

export const SortableAttachmentInputItem = React.forwardRef<
  HTMLLIElement,
  SortableAttachmentInputItemProps
>(({ fileEntry, index, ...props }, forwardedRef) => {
  const { readOnly } = useFileUploadContext();
  const itemName = fileEntry.file.name;
  const { itemRef, itemProps } = useAttachmentItemReorder({
    id: fileEntry.id,
    index,
    name: itemName,
    label: props["aria-label"] ?? `${itemName} 순서 변경`,
    disabled: readOnly,
    forwardedRef,
  });

  return <AttachmentInputItem ref={itemRef} fileEntry={fileEntry} {...props} {...itemProps} />;
});
SortableAttachmentInputItem.displayName = "SortableAttachmentInputItem";
