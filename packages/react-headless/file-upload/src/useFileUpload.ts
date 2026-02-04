import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { dataAttr, elementProps, inputProps, buttonProps } from "@seed-design/dom-utils";
import { useId, useState, useCallback, useRef } from "react";
import type {
  FileRejection,
  FileAcceptDetails,
  FileRejectDetails,
  FileChangeDetails,
  FileError,
} from "./types";

// =============================================================================
// State Hook
// =============================================================================

interface UseFileUploadStateProps {
  acceptedFiles?: File[];
  defaultAcceptedFiles?: File[];
  onFileAccept?: (details: FileAcceptDetails) => void;
  onFileReject?: (details: FileRejectDetails) => void;
  onFileChange?: (details: FileChangeDetails) => void;
}

function useFileUploadState(props: UseFileUploadStateProps) {
  const [acceptedFiles, setAcceptedFiles] = useControllableState<File[]>({
    prop: props.acceptedFiles,
    defaultProp: props.defaultAcceptedFiles ?? [],
    onChange: (files) => {
      props.onFileAccept?.({ files });
    },
  });

  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return {
    acceptedFiles: acceptedFiles ?? [],
    rejectedFiles,
    isDragging,
    isFocused,

    setAcceptedFiles,
    setRejectedFiles,
    setIsDragging,
    setIsFocused,
  };
}

// =============================================================================
// Main Hook
// =============================================================================

export interface UseFileUploadProps extends UseFileUploadStateProps {
  /**
   * Accepted file types (e.g., "image/*", ".pdf", "image/png")
   */
  accept?: string | string[];

  /**
   * Whether the file input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the file input is required.
   * @default false
   */
  required?: boolean;

  /**
   * Whether the file input is invalid.
   * @default false
   */
  invalid?: boolean;

  /**
   * Whether the file input is read-only.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Maximum number of files.
   * @default 1
   */
  maxFiles?: number;

  /**
   * Maximum file size in bytes.
   * @default Infinity
   */
  maxFileSize?: number;

  /**
   * Minimum file size in bytes.
   * @default 0
   */
  minFileSize?: number;

  /**
   * Whether to allow drag and drop.
   * @default true
   */
  allowDrop?: boolean;

  /**
   * The name attribute for the hidden input.
   */
  name?: string;

  /**
   * Custom validation function.
   */
  validate?: (file: File) => FileError[] | null;
}

export type UseFileUploadReturn = ReturnType<typeof useFileUpload>;

export function useFileUpload(props: UseFileUploadProps = {}) {
  const {
    accept,
    disabled = false,
    required = false,
    invalid = false,
    readOnly = false,
    maxFiles = 1,
    maxFileSize = Number.POSITIVE_INFINITY,
    minFileSize = 0,
    allowDrop = true,
    name,
    validate,
    onFileChange,
    onFileReject,
    ...stateProps
  } = props;

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    acceptedFiles,
    rejectedFiles,
    isDragging,
    isFocused,
    setAcceptedFiles,
    setRejectedFiles,
    setIsDragging,
    setIsFocused,
  } = useFileUploadState(stateProps);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const multiple = maxFiles > 1;
  const maxFilesReached = acceptedFiles.length >= maxFiles;
  const remainingFiles = Math.max(0, maxFiles - acceptedFiles.length);

  const acceptString = Array.isArray(accept) ? accept.join(",") : accept;

  // ---------------------------------------------------------------------------
  // File Validation
  // ---------------------------------------------------------------------------

  const isValidFileType = useCallback(
    (file: File): boolean => {
      if (!accept) return true;

      const acceptList = Array.isArray(accept) ? accept : accept.split(",").map((s) => s.trim());

      return acceptList.some((acceptPattern) => {
        // Handle extension patterns like ".pdf"
        if (acceptPattern.startsWith(".")) {
          return file.name.toLowerCase().endsWith(acceptPattern.toLowerCase());
        }
        // Handle MIME type patterns like "image/*" or "image/png"
        if (acceptPattern.includes("*")) {
          const [type] = acceptPattern.split("/");
          return file.type.startsWith(`${type}/`);
        }
        // Exact MIME type match
        return file.type === acceptPattern;
      });
    },
    [accept],
  );

  const validateFiles = useCallback(
    (files: File[]): { accepted: File[]; rejected: FileRejection[] } => {
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];

      const currentCount = acceptedFiles.length;
      let addedCount = 0;

      for (const file of files) {
        const errors: FileError[] = [];

        // Check max files limit
        if (currentCount + addedCount >= maxFiles) {
          errors.push({
            code: "TOO_MANY_FILES",
            message: `Maximum ${maxFiles} file(s) allowed`,
          });
        }

        // Check file type
        if (!isValidFileType(file)) {
          errors.push({
            code: "INVALID_TYPE",
            message: "File type not accepted",
          });
        }

        // Check max file size
        if (file.size > maxFileSize) {
          errors.push({
            code: "FILE_TOO_LARGE",
            message: `File size exceeds ${maxFileSize} bytes`,
          });
        }

        // Check min file size
        if (file.size < minFileSize) {
          errors.push({
            code: "FILE_TOO_SMALL",
            message: `File size is below ${minFileSize} bytes`,
          });
        }

        // Run custom validation
        if (validate) {
          const customErrors = validate(file);
          if (customErrors) {
            errors.push(...customErrors);
          }
        }

        if (errors.length > 0) {
          rejected.push({ file, errors });
        } else {
          accepted.push(file);
          addedCount++;
        }
      }

      return { accepted, rejected };
    },
    [maxFileSize, minFileSize, maxFiles, acceptedFiles.length, validate, isValidFileType],
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const openFilePicker = useCallback(() => {
    if (disabled || readOnly) return;
    inputRef.current?.click();
  }, [disabled, readOnly]);

  const setFiles = useCallback(
    (files: File[]) => {
      if (disabled || readOnly) return;
      const { accepted, rejected } = validateFiles(files);

      if (multiple) {
        setAcceptedFiles((prev) => [...(prev ?? []), ...accepted]);
      } else {
        setAcceptedFiles(accepted.length > 0 ? [accepted[0]] : []);
      }

      setRejectedFiles(rejected);

      if (rejected.length > 0) {
        onFileReject?.({ files: rejected });
      }

      onFileChange?.({
        acceptedFiles: multiple ? [...acceptedFiles, ...accepted] : accepted.slice(0, 1),
        rejectedFiles: rejected,
      });
    },
    [
      disabled,
      readOnly,
      multiple,
      validateFiles,
      setAcceptedFiles,
      setRejectedFiles,
      onFileReject,
      onFileChange,
      acceptedFiles,
    ],
  );

  const deleteFile = useCallback(
    (file: File) => {
      if (disabled || readOnly) return;
      setAcceptedFiles((prev) => (prev ?? []).filter((f) => f !== file));
    },
    [disabled, readOnly, setAcceptedFiles],
  );

  const clearFiles = useCallback(() => {
    if (disabled || readOnly) return;
    setAcceptedFiles([]);
    setRejectedFiles([]);
  }, [disabled, readOnly, setAcceptedFiles, setRejectedFiles]);

  const reorderFiles = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled || readOnly) return;
      setAcceptedFiles((prev) => {
        const files = [...(prev ?? [])];
        if (fromIndex < 0 || fromIndex >= files.length) return prev;
        if (toIndex < 0 || toIndex >= files.length) return prev;
        const [removed] = files.splice(fromIndex, 1);
        files.splice(toIndex, 0, removed);
        return files;
      });
    },
    [disabled, readOnly, setAcceptedFiles],
  );

  const createFileUrl = useCallback((file: File, callback: (url: string) => void) => {
    const url = URL.createObjectURL(file);
    callback(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  // ---------------------------------------------------------------------------
  // State Props
  // ---------------------------------------------------------------------------

  const stateDataAttrs = elementProps({
    "data-dragging": dataAttr(isDragging),
    "data-focus": dataAttr(isFocused),
    "data-disabled": dataAttr(disabled),
    "data-readonly": dataAttr(readOnly),
    "data-invalid": dataAttr(invalid),
  });

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    // Refs
    inputRef,

    // State
    acceptedFiles,
    rejectedFiles,
    dragging: isDragging,
    focused: isFocused,
    disabled,
    readOnly,
    invalid,
    required,
    maxFilesReached,
    remainingFiles,

    // Actions
    openFilePicker,
    setFiles,
    deleteFile,
    clearFiles,
    reorderFiles,
    createFileUrl,

    // Props getters
    stateProps: stateDataAttrs,

    rootProps: elementProps({
      ...stateDataAttrs,
    }),

    dropzoneProps: elementProps({
      ...stateDataAttrs,
      onDragOver: (event) => {
        if (disabled || readOnly || !allowDrop) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
      },
      onDragEnter: (event) => {
        if (disabled || readOnly || !allowDrop) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
      },
      onDragLeave: (event) => {
        if (disabled || readOnly || !allowDrop) return;
        event.preventDefault();
        event.stopPropagation();
        // Only set dragging to false if we're leaving the dropzone entirely
        const relatedTarget = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(relatedTarget)) {
          setIsDragging(false);
        }
      },
      onDrop: (event) => {
        if (disabled || readOnly || !allowDrop) return;
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          setFiles(Array.from(files));
        }
      },
    }),

    triggerProps: buttonProps({
      ...stateDataAttrs,
      type: "button",
      disabled: disabled || readOnly,
      onClick: openFilePicker,
    }),

    hiddenInputProps: inputProps({
      id: `file-upload-input-${id}`,
      type: "file",
      name,
      accept: acceptString,
      multiple,
      disabled: disabled || readOnly,
      required,
      tabIndex: -1,
      style: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      },
      onChange: (event) => {
        const files = event.target.files;
        if (files) {
          setFiles(Array.from(files));
        }
        // Reset input value to allow re-selecting the same file
        event.target.value = "";
      },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    }),

    getItemProps: (file: File) =>
      elementProps({
        ...stateDataAttrs,
        "data-file": file.name,
      }),

    getItemDeleteTriggerProps: (file: File) =>
      buttonProps({
        ...stateDataAttrs,
        type: "button",
        disabled: disabled || readOnly,
        "aria-label": `Delete ${file.name}`,
        onClick: () => deleteFile(file),
      }),
  };
}
