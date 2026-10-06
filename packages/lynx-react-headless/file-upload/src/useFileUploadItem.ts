import { useMemo } from "@lynx-js/react";
import type { FileEntry } from "./types.js";
import { useFileUploadContext } from "./useFileUploadContext.js";

export interface UseFileUploadItemOptions {
  /**
   * 이미지 미리보기(`imageProps`)를 만들지 정합니다.
   * @default Root의 `acceptType`이 `"image"`이면 `true`
   */
  imagePreview?: boolean;
}

export type UseFileUploadItemReturn = FileEntry & {
  /** 미리보기를 만들 때만 있습니다. `src`는 `file.previewUrl`, 없으면 `file.uri`입니다. */
  imageProps?: { src: string; alt: string };
  /** Root가 `readOnly`이면 삭제하지 않습니다. `disabled`에서는 삭제합니다. */
  removeButtonProps: { bindtap: () => void };
};

/**
 * @platform Lynx
 *
 * 첨부 항목 하나의 미리보기·삭제 연결을 만듭니다. 결과를 `FileUploadItemProvider`로 내려 item 파트가 읽게 합니다.
 * `FileUploadRoot` 안에서 호출합니다.
 */
export function useFileUploadItem(
  fileEntry: FileEntry,
  options: UseFileUploadItemOptions = {},
): UseFileUploadItemReturn {
  const { acceptType, readOnly, removeFileEntry } = useFileUploadContext();
  const imagePreview = options.imagePreview ?? acceptType === "image";
  const imageSource = fileEntry.file.previewUrl ?? fileEntry.file.uri;

  return useMemo(
    () => ({
      ...fileEntry,
      imageProps:
        imagePreview && imageSource ? { src: imageSource, alt: fileEntry.file.name } : undefined,
      removeButtonProps: {
        bindtap: () => {
          "background only";
          if (!readOnly) removeFileEntry(fileEntry.id);
        },
      },
    }),
    [fileEntry, imagePreview, imageSource, readOnly, removeFileEntry],
  );
}
