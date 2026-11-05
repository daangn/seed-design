import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseFileUploadReturn } from "./useFileUpload.js";
import type { UseFileUploadItemReturn } from "./useFileUploadItem.js";

export interface UseFileUploadContext extends UseFileUploadReturn {}

const FileUploadContext = createContext<UseFileUploadContext | null>(null);

export const FileUploadProvider: Provider<UseFileUploadContext | null> = FileUploadContext.Provider;

/**
 * `FileUploadRoot`가 내려준 `useFileUpload` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useFileUploadContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFileUploadContext | null : UseFileUploadContext {
  const context = useContext(FileUploadContext);
  if (!context && strict) {
    throw new Error("useFileUploadContext must be used within a FileUploadRoot");
  }
  return context as UseFileUploadContext;
}

export type FileUploadItemContext = UseFileUploadItemReturn;

const ItemContext = createContext<FileUploadItemContext | null>(null);

/** item 파트(`ItemName`·`ItemImage` 등)에 `useFileUploadItem` 결과를 제공합니다. */
export const FileUploadItemProvider: Provider<FileUploadItemContext | null> = ItemContext.Provider;

/**
 * `FileUploadItemProvider`가 내려준 item 상태를 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useFileUploadItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? FileUploadItemContext | null : FileUploadItemContext {
  const context = useContext(ItemContext);
  if (!context && strict) {
    throw new Error("useFileUploadItemContext must be used within a FileUploadItemProvider");
  }
  return context as FileUploadItemContext;
}
