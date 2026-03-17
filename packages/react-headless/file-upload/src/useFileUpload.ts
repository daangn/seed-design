import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  ariaAttr,
  dataAttr,
  elementProps,
  inputProps,
  buttonProps,
  visuallyHidden,
} from "@seed-design/dom-utils";
import { useState, useCallback, useRef } from "react";
import type {
  FileRejection,
  FileRejectDetails,
  FileError,
  FileWithStatus,
  FileStatusDetails,
} from "./types";
import { getFileAcceptType } from "./accept-utils";

// =============================================================================
// State Hook
// =============================================================================

interface UseFileUploadStateProps {
  acceptedFiles?: FileWithStatus[];
  defaultAcceptedFiles?: FileWithStatus[];
  onAcceptedFilesChange?: (files: FileWithStatus[]) => void;
  onFileReject?: (details: FileRejectDetails) => void;
}

function useFileUploadState(props: UseFileUploadStateProps) {
  const [acceptedFiles, setAcceptedFiles] = useControllableState<FileWithStatus[]>({
    prop: props.acceptedFiles,
    defaultProp: props.defaultAcceptedFiles ?? [],
    onChange: (filesWithStatus) => {
      props.onAcceptedFilesChange?.(filesWithStatus);
    },
  });

  const [isDragging, setIsDragging] = useState(false);

  return {
    acceptedFiles: acceptedFiles ?? [],
    isDragging,

    setAcceptedFiles,
    setIsDragging,
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
   * @default false
   */
  disabled?: boolean;
  /**
   * @default false
   */
  required?: boolean;
  /**
   * @default false
   */
  invalid?: boolean;

  /**
   * NOTE: this currently is a no-op since the UI doesn't have a readOnly state
   * @default false
   */
  readOnly?: boolean;

  /**
   * @default 1
   */
  maxFiles?: number;
  /**
   * @default Infinity
   */
  maxFileSize?: number;
  /**
   * @default 0
   */
  minFileSize?: number;

  name?: string;

  /**
   * Custom validation function.
   */
  validate?: (file: File) => FileError[] | null;
}

export type UseFileUploadReturn = ReturnType<typeof useFileUpload>;

export function useFileUpload({
  accept,
  disabled = false,
  required = false,
  invalid = false,
  readOnly = false,
  maxFiles = 1,
  maxFileSize = Number.POSITIVE_INFINITY,
  minFileSize = 0,
  name,
  validate,
  onFileReject,
  ...props
}: UseFileUploadProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { acceptedFiles, isDragging, setAcceptedFiles, setIsDragging } = useFileUploadState(props);

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  const multiple = maxFiles > 1;
  const maxFilesReached = acceptedFiles.length >= maxFiles;

  const acceptString = Array.isArray(accept) ? accept.join(",") : accept;

  const acceptType = getFileAcceptType(accept);

  // ---------------------------------------------------------------------------
  // File Validation
  // ---------------------------------------------------------------------------

  const isValidFileType = useCallback(
    (file: File): boolean => {
      if (!accept) return true;

      const acceptList = Array.isArray(accept) ? accept : accept.split(",").map((s) => s.trim());

      return acceptList.some((acceptPattern) => {
        // .pdf
        if (acceptPattern.startsWith("."))
          return file.name.toLowerCase().endsWith(acceptPattern.toLowerCase());

        // image/* or image/png
        if (acceptPattern.includes("*")) {
          const [type] = acceptPattern.split("/");

          return file.type.startsWith(`${type}/`);
        }

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

        if (currentCount + addedCount >= maxFiles) {
          errors.push("TOO_MANY_FILES");
        }

        if (!isValidFileType(file)) {
          errors.push("INVALID_TYPE");
        }

        if (file.size > maxFileSize) {
          errors.push("FILE_TOO_LARGE");
        }

        if (file.size < minFileSize) {
          errors.push("FILE_TOO_SMALL");
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
    if (disabled) return;

    inputRef.current?.click();
  }, [disabled]);

  const setFiles = useCallback(
    (files: File[]) => {
      if (disabled) return;

      const { accepted, rejected } = validateFiles(files);

      const acceptedWithStatus: FileWithStatus[] = accepted.map((file) => ({
        file,
        details: { status: "pending" },
      }));

      if (multiple) {
        setAcceptedFiles((prev) => [...(prev ?? []), ...acceptedWithStatus]);
      } else {
        setAcceptedFiles(acceptedWithStatus.length > 0 ? [acceptedWithStatus[0]] : []);
      }

      if (rejected.length > 0) {
        onFileReject?.({ files: rejected });
      }
    },
    [disabled, multiple, validateFiles, setAcceptedFiles, onFileReject],
  );

  const reorderFiles = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled) return;
      setAcceptedFiles((prev) => {
        const files = [...(prev ?? [])];
        if (fromIndex < 0 || fromIndex >= files.length) return prev;
        if (toIndex < 0 || toIndex >= files.length) return prev;
        const [removed] = files.splice(fromIndex, 1);
        files.splice(toIndex, 0, removed);
        return files;
      });
    },
    [disabled, setAcceptedFiles],
  );

  const createFileUrl = useCallback((file: File, callback: (url: string) => void) => {
    const url = URL.createObjectURL(file);
    callback(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  const updateFileStatus = useCallback(
    (file: File, details: FileStatusDetails) => {
      setAcceptedFiles((prev) =>
        (prev ?? []).map((f) => (f.file === file ? { file, details } : f)),
      );
    },
    [setAcceptedFiles],
  );

  const removeFile = useCallback(
    (file: File) => {
      setAcceptedFiles((prev) => (prev ?? []).filter(({ file: f }) => f !== file));
    },
    [setAcceptedFiles],
  );

  const clearFiles = useCallback(() => {
    setAcceptedFiles([]);
  }, [setAcceptedFiles]);

  // ---------------------------------------------------------------------------
  // State Props
  // ---------------------------------------------------------------------------

  const stateProps = elementProps({
    "data-dragging": dataAttr(isDragging),
    "data-disabled": dataAttr(disabled || maxFilesReached),
    "data-invalid": dataAttr(invalid),
  });

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    inputRef,

    acceptedFiles,
    dragging: isDragging,
    disabled,
    invalid,
    required,
    maxFiles,
    currentFileCount: acceptedFiles.length,
    acceptType,

    openFilePicker,
    setFiles,
    reorderFiles,
    createFileUrl,
    updateFileStatus,
    removeFile,
    clearFiles,

    stateProps,

    rootProps: elementProps({
      ...stateProps,
    }),

    dropzoneProps: elementProps({
      ...stateProps,
      onDragOver: (event) => {
        if (disabled) return;

        event.preventDefault();
        event.stopPropagation();

        setIsDragging(true);
      },
      onDragEnter: (event) => {
        if (disabled) return;

        event.preventDefault();
        event.stopPropagation();

        setIsDragging(true);
      },
      onDragLeave: (event) => {
        if (disabled) return;

        event.preventDefault();
        event.stopPropagation();

        // Only set dragging to false if we're leaving the dropzone entirely
        const relatedTarget = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(relatedTarget)) {
          setIsDragging(false);
        }
      },
      onDrop: (event) => {
        if (disabled) return;

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
      ...stateProps,

      type: "button",
      disabled: disabled || maxFilesReached,
      onClick: openFilePicker,
    }),

    hiddenInputProps: inputProps({
      type: "file",
      name,

      accept: acceptString,
      multiple,

      disabled: disabled || maxFilesReached,
      "aria-required": ariaAttr(required),

      tabIndex: -1,
      style: visuallyHidden,

      onChange: (event) => {
        const files = event.target.files;

        if (files) {
          setFiles(Array.from(files));
        }

        // Reset input value to allow re-selecting the same file
        event.target.value = "";
      },
    }),

    getItemRemoveButtonProps: (file: File) =>
      buttonProps({
        type: "button",
        // NOTE: `disabled` of item remove button works separately from the overall `disabled` state so we don't have stateProps here

        onClick: () => {
          removeFile(file);
        },
      }),
  };
}
