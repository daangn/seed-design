import { createContext, useContext } from "react";
import type { UseFileUploadReturn } from "./useFileUpload";
import type { FileWithStatus } from "./types";

// =============================================================================
// FileUpload Context
// =============================================================================

export type UseFileUploadContext = UseFileUploadReturn;

const FileUploadContext = createContext<UseFileUploadContext | null>(null);

export const FileUploadProvider = FileUploadContext.Provider;

export function useFileUploadContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFileUploadContext | null : UseFileUploadContext {
  const context = useContext(FileUploadContext);
  if (!context && strict) {
    throw new Error("useFileUploadContext must be used within a FileUpload");
  }

  return context as UseFileUploadContext;
}

// =============================================================================
// FileUploadItem Context
// =============================================================================

export type FileUploadItemContext = FileWithStatus;

const ItemContext = createContext<FileUploadItemContext | null>(null);

export const FileUploadItemProvider = ItemContext.Provider;

export function useFileUploadItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? FileUploadItemContext | null : FileUploadItemContext {
  const context = useContext(ItemContext);
  if (!context && strict) {
    throw new Error("useFileUploadItemContext must be used within a FileUploadItem");
  }

  return context as FileUploadItemContext;
}
