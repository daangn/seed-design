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
import type { FileRejection, FileError, FileEntry, FileStatusDetails } from "./types";
import { getFileAcceptType } from "./accept-utils";

interface UseFileUploadStateProps {
  acceptedFiles?: FileEntry[];
  defaultAcceptedFiles?: FileEntry[];
  onAcceptedFilesChange?: (fileEntries: FileEntry[]) => void;
  onFileReject?: (rejections: FileRejection[]) => void;
}

function useFileUploadState(props: UseFileUploadStateProps) {
  const [acceptedFiles, setAcceptedFiles] = useControllableState<FileEntry[]>({
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
  const idCounterRef = useRef(0);

  const { acceptedFiles, isDragging, setAcceptedFiles, setIsDragging } = useFileUploadState(props);

  const multiple = maxFiles > 1;
  const maxFilesReached = acceptedFiles.length >= maxFiles;
  const triggerDisabled = disabled || maxFilesReached;

  const acceptString = Array.isArray(accept) ? accept.join(",") : accept;

  const acceptType = getFileAcceptType(accept);

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

  const openFilePicker = useCallback(() => {
    if (triggerDisabled) return;

    inputRef.current?.click();
  }, [triggerDisabled]);

  const setFiles = useCallback(
    (files: File[]) => {
      if (disabled) return;

      const { accepted, rejected } = validateFiles(files);

      const acceptedEntries: FileEntry[] = accepted.map((file) => ({
        id: `file-${++idCounterRef.current}`,
        file,
        status: "pending",
      }));

      if (multiple) {
        setAcceptedFiles((prev) => [...(prev ?? []), ...acceptedEntries]);
      } else {
        setAcceptedFiles(acceptedEntries.length > 0 ? [acceptedEntries[0]] : []);
      }

      if (rejected.length > 0) {
        onFileReject?.(rejected);
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
    (id: string, details: FileStatusDetails) => {
      setAcceptedFiles((prev) => (prev ?? []).map((f) => (f.id === id ? { ...f, ...details } : f)));
    },
    [setAcceptedFiles],
  );

  const removeFile = useCallback(
    (id: string) => {
      setAcceptedFiles((prev) => (prev ?? []).filter((f) => f.id !== id));
    },
    [setAcceptedFiles],
  );

  const clearFiles = useCallback(() => {
    setAcceptedFiles([]);
  }, [setAcceptedFiles]);

  const stateProps = elementProps({
    "data-dragging": dataAttr(isDragging),
    "data-disabled": dataAttr(triggerDisabled),
    "data-invalid": dataAttr(invalid),
  });

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
      disabled: triggerDisabled,
      onClick: openFilePicker,

      // escape hatch: triggerProps is meant to be spread on ActionButton,
      // but ActionButton overrides HTML `color` attribute for its fg color
    }) as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,

    hiddenInputProps: inputProps({
      type: "file",
      name,

      accept: acceptString,
      multiple,

      disabled: triggerDisabled,
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

    getItemRemoveButtonProps: (id: string) =>
      buttonProps({
        type: "button",
        // NOTE: `disabled` of item remove button works separately from the overall `disabled` state so we don't have stateProps here

        onClick: () => {
          removeFile(id);
        },
      }),
  };
}
