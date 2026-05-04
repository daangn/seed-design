export {
  FileUploadRoot,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadHiddenInput,
  FileUploadItemName,
  FileUploadItemSize,
  FileUploadItemRemoveButton,
  FileUploadItemImage,
  FileUploadItemThumbnail,
  FileUploadItemMetadata,
  FileUploadItemBackdrop,
  FileUploadContext,
  type FileUploadRootProps,
  type FileUploadDropzoneProps,
  type FileUploadTriggerProps,
  type FileUploadHiddenInputProps,
  type FileUploadItemNameProps,
  type FileUploadItemSizeProps,
  type FileUploadItemRemoveButtonProps,
  type FileUploadItemImageProps,
  type FileUploadItemThumbnailProps,
  type FileUploadItemMetadataProps,
  type FileUploadItemBackdropProps,
  type FileUploadContextProps,
} from "./FileUpload";

export {
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItemContext,
  type UseFileUploadContext,
  type FileUploadItemContext,
} from "./useFileUploadContext";

export {
  useFileUpload,
  useFileUploadItem,
  type UseFileUploadProps,
  type UseFileUploadReturn,
  type UseFileUploadItemReturn,
} from "./useFileUpload";

export type {
  FileError,
  FileRejection,
  FileStatusDetails,
  FileEntry,
  FileAcceptType,
} from "./types";

export * as FileUpload from "./FileUpload.namespace";

export { splitFileName, type SplitFileNameResult } from "./utils";
