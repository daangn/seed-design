"use client";

import * as React from "react";
import { FileUpload as SeedFileUpload, PrefixIcon } from "@seed-design/react";
import { useFileUploadContext } from "@seed-design/react/primitive";
import {
  IconCameraFill,
  IconPaperclipFill,
  IconArrowUpBracketDownFill,
} from "@karrotmarket/react-monochrome-icon";

import { ActionButton } from "./action-button";
import { FileUploadItem, type FileUploadItemProps } from "./file-upload";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { RestrictToHorizontalAxis } from "@dnd-kit/abstract/modifiers";
import { Accessibility } from "@dnd-kit/dom";

const LABEL_SELECT_FILE = "파일 선택";
const LABEL_DROP_FILE = "또는 여기로 드래그해서 업로드";

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

export interface ReorderableFileUploadProps {
  children?: SeedFileUpload.ContextProps["children"];
}

export const ReorderableFileUpload = React.forwardRef<HTMLDivElement, ReorderableFileUploadProps>(
  ({ children }, ref) => {
    const { reorderFileEntry } = useFileUploadContext();

    return (
      <DragDropProvider
        plugins={(defaults) => [...defaults, accessibilityPlugin]}
        onDragEnd={({ canceled, operation: { source } }) => {
          if (canceled) return;
          if (!isSortable(source)) return;

          reorderFileEntry(source.sortable.initialIndex, source.sortable.index);
        }}
      >
        <SeedFileUpload.Container ref={ref}>
          <SeedFileUpload.Trigger aria-label={LABEL_SELECT_FILE}>
            <SeedFileUpload.TriggerIcon
              image={<IconCameraFill />}
              general={<IconPaperclipFill />}
            />
            <SeedFileUpload.TriggerItemCount />
          </SeedFileUpload.Trigger>
          <SeedFileUpload.ItemGroup>
            <SeedFileUpload.Context>
              {typeof children === "function"
                ? children
                : ({ acceptedFileEntries }) =>
                    acceptedFileEntries.map((fileEntry, index) => (
                      <SortableFileUploadItem
                        key={fileEntry.id}
                        fileEntry={fileEntry}
                        index={index}
                      />
                    ))}
            </SeedFileUpload.Context>
          </SeedFileUpload.ItemGroup>
        </SeedFileUpload.Container>
      </DragDropProvider>
    );
  },
);
ReorderableFileUpload.displayName = "ReorderableFileUpload";

export interface ReorderableFileUploadDropzoneProps {
  children?: SeedFileUpload.ContextProps["children"];
}

export const ReorderableFileUploadDropzone: React.FC<ReorderableFileUploadDropzoneProps> = ({
  children,
}) => {
  const { triggerProps, reorderFileEntry } = useFileUploadContext();

  return (
    <>
      <SeedFileUpload.Dropzone>
        <ActionButton variant="neutralWeak" size="small" layout="withText" {...triggerProps}>
          <PrefixIcon svg={<IconArrowUpBracketDownFill />} />
          {LABEL_SELECT_FILE}
        </ActionButton>
        <SeedFileUpload.DropzoneLabel>{LABEL_DROP_FILE}</SeedFileUpload.DropzoneLabel>
      </SeedFileUpload.Dropzone>
      <DragDropProvider
        plugins={(defaults) => [...defaults, accessibilityPlugin]}
        onDragEnd={({ canceled, operation: { source } }) => {
          if (canceled) return;
          if (!isSortable(source)) return;

          reorderFileEntry(source.sortable.initialIndex, source.sortable.index);
        }}
      >
        <SeedFileUpload.Container>
          <SeedFileUpload.ItemGroup>
            <SeedFileUpload.Context>
              {typeof children === "function"
                ? children
                : ({ acceptedFileEntries }) =>
                    acceptedFileEntries.map((fileEntry, index) => (
                      <SortableFileUploadItem
                        key={fileEntry.id}
                        fileEntry={fileEntry}
                        index={index}
                      />
                    ))}
            </SeedFileUpload.Context>
          </SeedFileUpload.ItemGroup>
        </SeedFileUpload.Container>
      </DragDropProvider>
    </>
  );
};
ReorderableFileUploadDropzone.displayName = "ReorderableFileUploadDropzone";

interface SortableFileUploadItemProps extends FileUploadItemProps {
  index: number;
}

const SortableFileUploadItem = React.forwardRef<HTMLLIElement, SortableFileUploadItemProps>(
  ({ fileEntry, index, ...props }, _ref) => {
    const { ref: sortableRef } = useSortable({
      id: fileEntry.id,
      index,
      modifiers: [RestrictToHorizontalAxis],
      data: { name: fileEntry.file.name },
    });

    return <FileUploadItem ref={sortableRef} fileEntry={fileEntry} {...props} />;
  },
);
SortableFileUploadItem.displayName = "SortableFileUploadItem";
