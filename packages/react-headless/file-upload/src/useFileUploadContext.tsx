import { createContext, useContext } from "react";
import type { UseFileUploadReturn } from "./useFileUpload";

// =============================================================================
// FileUpload Context
// =============================================================================

export interface UseFileUploadContext extends UseFileUploadReturn {}

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

export interface FileUploadItemContext {
  file: File;
}

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
