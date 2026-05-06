import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  ariaAttr,
  dataAttr,
  elementProps,
  inputProps,
  buttonProps,
  visuallyHidden,
} from "@seed-design/dom-utils";
import { useState, useCallback, useRef, useEffect } from "react";
import type { FileRejection, FileError, FileEntry, FileStatusDetails } from "./types";
import { getFileAcceptType } from "./accept-utils";
import { useFileUploadContext } from "./useFileUploadContext";

function syncInputFiles(inputEl: HTMLInputElement, files: File[]) {
  const dataTransfer = new DataTransfer();

  for (const file of files) {
    dataTransfer.items.add(file);
  }

  inputEl.files = dataTransfer.files;
}

interface UseFileUploadStateProps {
  acceptedFileEntries?: FileEntry[];
  defaultAcceptedFileEntries?: FileEntry[];
  onAcceptedFileEntriesChange?: (fileEntries: FileEntry[]) => void;
  onFileReject?: (rejections: FileRejection[]) => void;
  onFileAccept?: (
    acceptedEntries: FileEntry[],
    helpers: { updateFileEntryStatus: (id: string, details: FileStatusDetails) => void },
  ) => void;
}

function useFileUploadState(props: UseFileUploadStateProps) {
  const [acceptedFileEntries, setAcceptedFileEntries] = useControllableState<FileEntry[]>({
    prop: props.acceptedFileEntries,
    defaultProp: props.defaultAcceptedFileEntries ?? [],
    onChange: (filesWithStatus) => {
      props.onAcceptedFileEntriesChange?.(filesWithStatus);
    },
  });

  const [isDragging, setIsDragging] = useState(false);

  return {
    acceptedFileEntries: acceptedFileEntries ?? [],
    isDragging,

    setAcceptedFileEntries,
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

  /**
   * Whether to prevent the browser's default behavior when files are dropped
   * outside the dropzone (e.g., opening the file in a new tab).
   * @default true
   */
  preventDocumentDrop?: boolean;
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
  preventDocumentDrop = true,
  onFileReject,
  onFileAccept,
  ...props
}: UseFileUploadProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);

  const { acceptedFileEntries, isDragging, setAcceptedFileEntries, setIsDragging } =
    useFileUploadState(props);

  const multiple = maxFiles > 1;
  const maxFilesReached = acceptedFileEntries.length >= maxFiles;
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

      const currentCount = acceptedFileEntries.length;
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
    [maxFileSize, minFileSize, maxFiles, acceptedFileEntries.length, validate, isValidFileType],
  );

  const openFilePicker = useCallback(() => {
    if (triggerDisabled) return;
    if (!inputRef.current) return;

    // Reset value before opening the picker so re-selecting the same file still fires a change event
    // see: https://github.com/chakra-ui/zag/blob/main/packages/machines/file-upload/src/file-upload.connect.ts
    inputRef.current.value = "";
    inputRef.current.click();
  }, [triggerDisabled]);

  const updateFileEntryStatus = useCallback(
    (id: string, details: FileStatusDetails) => {
      setAcceptedFileEntries((prev) =>
        (prev ?? []).map((f) => (f.id === id ? { ...f, ...details } : f)),
      );
    },
    [setAcceptedFileEntries],
  );

  const setFileEntries = useCallback(
    (files: File[]) => {
      if (disabled) return;

      const { accepted, rejected } = validateFiles(files);

      const acceptedEntries: FileEntry[] = accepted.map((file) => ({
        id: `file-${Date.now()}-${++idCounterRef.current}`,
        file,
        status: "pending",
      }));

      if (acceptedEntries.length > 0) {
        const finalEntries = multiple ? acceptedEntries : [acceptedEntries[0]];
        if (multiple) {
          setAcceptedFileEntries((prev) => [...(prev ?? []), ...finalEntries]);
        } else {
          setAcceptedFileEntries(finalEntries);
        }
        onFileAccept?.(finalEntries, { updateFileEntryStatus });
      }

      if (rejected.length > 0) {
        onFileReject?.(rejected);
      }
    },
    [
      disabled,
      multiple,
      validateFiles,
      setAcceptedFileEntries,
      onFileReject,
      onFileAccept,
      updateFileEntryStatus,
    ],
  );

  const reorderFileEntry = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled) return;
      setAcceptedFileEntries((prev) => {
        const files = [...(prev ?? [])];

        if (fromIndex < 0 || fromIndex >= files.length) return prev;
        if (toIndex < 0 || toIndex >= files.length) return prev;

        const [removed] = files.splice(fromIndex, 1);
        files.splice(toIndex, 0, removed);

        return files;
      });
    },
    [disabled, setAcceptedFileEntries],
  );

  const createFileUrl = useCallback((file: File, callback: (url: string) => void) => {
    const url = URL.createObjectURL(file);
    callback(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  const removeFileEntry = useCallback(
    (id: string) => {
      setAcceptedFileEntries((prev) => (prev ?? []).filter((f) => f.id !== id));
    },
    [setAcceptedFileEntries],
  );

  const clearFileEntries = useCallback(() => {
    setAcceptedFileEntries([]);
  }, [setAcceptedFileEntries]);

  const stateProps = elementProps({
    "data-dragging-over": dataAttr(isDragging),
    "data-disabled": dataAttr(triggerDisabled),
    "data-invalid": dataAttr(invalid),
  });

  useEffect(() => {
    if (!inputRef.current) return;
    syncInputFiles(
      inputRef.current,
      acceptedFileEntries.map((e) => e.file),
    );
  }, [acceptedFileEntries]);

  useEffect(() => {
    if (!preventDocumentDrop) return;
    if (disabled) return;

    const onDragOver = (event: Event) => {
      if (!dropzoneRef.current) return;

      event.preventDefault();
    };

    const onDrop = (event: Event) => {
      if (!dropzoneRef.current) return;

      const target = event.target as Node | null;
      if (dropzoneRef.current.contains(target)) return;

      event.preventDefault();
    };

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, [preventDocumentDrop, disabled]);

  return {
    inputRef,
    dropzoneRef,

    acceptedFileEntries,
    dragging: isDragging,
    disabled,
    invalid,
    required,
    maxFiles,
    currentFileEntryCount: acceptedFileEntries.length,
    acceptType,

    openFilePicker,
    setFileEntries,
    reorderFileEntry,
    createFileUrl,
    updateFileEntryStatus,
    removeFileEntry,
    clearFileEntries,

    stateProps,

    dropzoneProps: elementProps({
      ...stateProps,
      onDragOver: (event) => {
        if (triggerDisabled) return;

        event.preventDefault();
        event.stopPropagation();

        setIsDragging(true);
      },
      onDragEnter: (event) => {
        if (triggerDisabled) return;

        event.preventDefault();
        event.stopPropagation();

        setIsDragging(true);
      },
      onDragLeave: (event) => {
        if (triggerDisabled) return;

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
          setFileEntries(Array.from(files));
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

      disabled,
      "aria-required": ariaAttr(required),

      tabIndex: -1,
      style: visuallyHidden,

      onChange: (event) => {
        const files = event.target.files;

        if (files) {
          setFileEntries(Array.from(files));
        }

        event.target.value = "";
      },
    }),
  };
}

export type UseFileUploadItemReturn = ReturnType<typeof useFileUploadItem>;

export function useFileUploadItem(fileEntry: FileEntry) {
  const { createFileUrl, removeFileEntry, acceptType } = useFileUploadContext();

  const [isOverlayRendered, setIsOverlayRendered] = useState(false);
  const overlayRef = useCallback((node: HTMLElement | null) => {
    setIsOverlayRendered(!!node);
  }, []);

  // Image blob URL management
  const [imageSrc, setImageSrc] = useState<string>();

  useEffect(() => {
    if (acceptType !== "image") return;
    if (!fileEntry.file) return;

    return createFileUrl(fileEntry.file, setImageSrc);
  }, [fileEntry.file, createFileUrl, acceptType]);

  const overlayStateProps = elementProps({
    "data-has-overlay": dataAttr(isOverlayRendered),
  });

  return {
    ...fileEntry,

    refs: { overlay: overlayRef },

    ...(acceptType === "image" &&
      imageSrc && {
        imageProps: {
          src: imageSrc,
          alt: fileEntry.file.name,
        } satisfies React.ImgHTMLAttributes<HTMLImageElement>,
      }),

    thumbnailProps: overlayStateProps,
    metadataProps: overlayStateProps,

    // NOTE: `disabled` of item remove button works separately from the overall `disabled` state so we don't have stateProps here
    removeButtonProps: buttonProps({
      type: "button",
      onClick: () => {
        removeFileEntry(fileEntry.id);
      },
    }),
  };
}
