import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import {
  attachmentInput,
  type AttachmentInputVariantProps,
} from "@seed-design/lynx-css/recipes/attachment-input";
import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/lynx-css/recipes/attachment-input-item";
import {
  attachmentInputTrigger,
  type AttachmentInputTriggerVariantProps,
} from "@seed-design/lynx-css/recipes/attachment-input-trigger";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextProps,
} from "../../types";
import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { toArray } from "../../utils/children";
import clsx from "clsx";
import { useFieldContext } from "../Field/context";
import { IconSlotProvider, InternalIcon } from "../Icon/Icon";

export interface NativeFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
}

export type AttachmentFileError =
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOO_MANY_FILES"
  | "INVALID_TYPE"
  | (string & {});

export interface AttachmentFileRejection {
  file: NativeFile;
  errors: AttachmentFileError[];
}

export type AttachmentFileStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export type AttachmentFileEntry = {
  id: string;
  file: NativeFile;
} & AttachmentFileStatusDetails;

export interface AttachmentInputStateProps {
  acceptedFileEntries?: AttachmentFileEntry[];
  defaultAcceptedFileEntries?: AttachmentFileEntry[];
  onAcceptedFileEntriesChange?: (entries: AttachmentFileEntry[]) => void;
  onFileReject?: (rejections: AttachmentFileRejection[]) => void;
  onFileAccept?: (
    entries: AttachmentFileEntry[],
    helpers: { updateFileEntryStatus: (id: string, details: AttachmentFileStatusDetails) => void },
  ) => void;
}

export interface AttachmentInputProps extends AttachmentInputStateProps {
  accept?: string | string[];
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  minFileSize?: number;
  validate?: (file: NativeFile) => AttachmentFileError[] | null;
  onSelectFiles?: () => NativeFile[] | Promise<NativeFile[]>;
  onSelectError?: (error: unknown) => void;
}

export type AttachmentInputItemContextValue = AttachmentFileEntry & {
  removeButtonProps: LynxPressableProps;
  imageProps?: { src: string; alt?: string };
};

interface AttachmentInputStateDataProps {
  "data-disabled": boolean;
  "data-readonly": boolean;
  "data-invalid": boolean;
  "data-required": boolean;
}

export interface AttachmentInputContextValue extends AttachmentInputProps {
  acceptedFileEntries: AttachmentFileEntry[];
  currentFileEntryCount: number;
  acceptType?: "image";
  multiple: boolean;
  maxFiles: number;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  readOnly: boolean;
  triggerDisabled: boolean;
  stateProps: AttachmentInputStateDataProps;
  openFilePicker: () => void;
  setFileEntries: (files: NativeFile[]) => void;
  updateFileEntryStatus: (id: string, details: AttachmentFileStatusDetails) => void;
  removeFileEntry: (id: string) => void;
  clearFileEntries: () => void;
  reorderFileEntry: (fromIndex: number, toIndex: number) => void;
}

interface NativeViewProps extends LynxAccessibilityProps {
  id?: string;
  flatten?: boolean;
}
function pickNativeViewProps(
  props: LynxStyledElementProps & NativeViewProps,
): LynxStyledElementProps & NativeViewProps {
  return {
    id: props.id,
    flatten: props.flatten,
    style: props.style,
    "accessibility-label": props["accessibility-label"],
    "accessibility-traits": props["accessibility-traits"],
    "accessibility-element": props["accessibility-element"],
    "accessibility-value": props["accessibility-value"],
    "accessibility-role-description": props["accessibility-role-description"],
    "accessibility-elements-hidden": props["accessibility-elements-hidden"],
    "accessibility-heading": props["accessibility-heading"],
    "accessibility-actions": props["accessibility-actions"],
    "accessibility-exclusive-focus": props["accessibility-exclusive-focus"],
    "ios-platform-accessibility-id": props["ios-platform-accessibility-id"],
  };
}
type NativeTextElementProps = Omit<LynxTextProps, "children" | "className" | "style">;
type NativeImageProps = Omit<
  IntrinsicElements["image"],
  "children" | "className" | "style" | "src"
>;
type NativeScrollViewProps = Omit<
  IntrinsicElements["scroll-view"],
  "children" | "className" | "style"
>;

const rootRecipe = createSlotRecipeContext(attachmentInput);
const triggerRecipe = createSlotRecipeContext(attachmentInputTrigger);
const itemRecipe = createSlotRecipeContext(attachmentInputItem);

const AttachmentInputContextObject = React.createContext<AttachmentInputContextValue | null>(null);
const AttachmentInputItemContextObject =
  React.createContext<AttachmentInputItemContextValue | null>(null);

export function useAttachmentInputContext(): AttachmentInputContextValue {
  const context = React.useContext(AttachmentInputContextObject);
  if (!context) {
    throw new Error("AttachmentInput components must be used within AttachmentInput.Root");
  }
  return context;
}

export function useAttachmentInputItemContext(): AttachmentInputItemContextValue {
  const context = React.useContext(AttachmentInputItemContextObject);
  if (!context) {
    throw new Error("AttachmentInput item components must be used within AttachmentInput.Item");
  }
  return context;
}

function isAcceptedType(file: NativeFile, accept?: string | string[]): boolean {
  if (!accept) return true;

  const patterns = (Array.isArray(accept) ? accept : accept.split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return fileName.endsWith(pattern);
    if (pattern.endsWith("/*")) return fileType.startsWith(pattern.slice(0, -1));
    if (pattern.includes("*")) {
      const [type] = pattern.split("/");
      return fileType.startsWith(`${type}/`);
    }
    return fileType === pattern;
  });
}

function isImageAcceptPattern(pattern: string): boolean {
  if (pattern.startsWith("image/")) return true;
  return [".avif", ".bmp", ".gif", ".heic", ".heif", ".jpeg", ".jpg", ".png", ".webp"].some(
    (extension) => pattern === extension,
  );
}

function getAcceptType(accept?: string | string[]): "image" | undefined {
  if (!accept) return undefined;
  const patterns = (Array.isArray(accept) ? accept : accept.split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return patterns.length > 0 && patterns.every(isImageAcceptPattern) ? "image" : undefined;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${Number.parseFloat((bytes / 1024 ** index).toFixed(1))} ${units[index]}`;
}

export function useAttachmentInput(props: AttachmentInputProps = {}): AttachmentInputContextValue {
  const {
    acceptedFileEntries: value,
    defaultAcceptedFileEntries = [],
    onAcceptedFileEntriesChange,
    onFileAccept,
    onFileReject,
    accept,
    disabled: disabledProp,
    required: requiredProp,
    invalid: invalidProp,
    readOnly: readOnlyProp,
    maxFiles: maxFilesProp = 1,
    maxFileSize = Number.POSITIVE_INFINITY,
    minFileSize = 0,
    validate,
    onSelectFiles,
    onSelectError,
  } = props;
  const fieldContext = useFieldContext({ strict: false });
  const disabled = disabledProp ?? fieldContext?.disabled ?? false;
  const required = requiredProp ?? fieldContext?.required ?? false;
  const invalid = invalidProp ?? fieldContext?.invalid ?? false;
  const readOnly = readOnlyProp ?? fieldContext?.readOnly ?? false;
  const maxFiles = Math.max(1, maxFilesProp);
  const [acceptedFileEntries, setAcceptedFileEntries] = useControllableState<AttachmentFileEntry[]>(
    {
      value,
      defaultValue: defaultAcceptedFileEntries,
      onChange: onAcceptedFileEntriesChange,
    },
  );
  const entries = acceptedFileEntries ?? [];
  const entriesRef = React.useRef(entries);
  entriesRef.current = entries;
  const optionsRef = React.useRef({
    disabled,
    readOnly,
    accept,
    maxFiles,
    maxFileSize,
    minFileSize,
    validate,
    onSelectFiles,
    onSelectError,
    onFileAccept,
    onFileReject,
  });
  optionsRef.current = {
    disabled,
    readOnly,
    accept,
    maxFiles,
    maxFileSize,
    minFileSize,
    validate,
    onSelectFiles,
    onSelectError,
    onFileAccept,
    onFileReject,
  };
  const idCounterRef = React.useRef(0);
  const pickerRequestRef = React.useRef(0);
  const mountedRef = React.useRef(true);
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      pickerRequestRef.current += 1;
    };
  }, []);

  const multiple = maxFiles > 1;
  const maxFilesReached = entries.length >= maxFiles;
  const triggerDisabled = disabled || readOnly || maxFilesReached;
  const acceptType = getAcceptType(accept);

  const updateFileEntryStatus = React.useCallback(
    (id: string, details: AttachmentFileStatusDetails) => {
      const next = entriesRef.current.map((entry) =>
        entry.id === id ? { ...entry, ...details } : entry,
      );
      entriesRef.current = next;
      setAcceptedFileEntries(next);
    },
    [setAcceptedFileEntries],
  );

  const validateFiles = React.useCallback((files: NativeFile[]) => {
    const {
      accept: currentAccept,
      maxFileSize: currentMaxFileSize,
      minFileSize: currentMinFileSize,
      maxFiles: currentMaxFiles,
      validate: currentValidate,
    } = optionsRef.current;
    const accepted: NativeFile[] = [];
    const rejected: AttachmentFileRejection[] = [];
    let addedCount = 0;

    for (const file of files) {
      const errors: AttachmentFileError[] = [];
      if (entriesRef.current.length + addedCount >= currentMaxFiles) errors.push("TOO_MANY_FILES");
      if (!isAcceptedType(file, currentAccept)) errors.push("INVALID_TYPE");
      if (file.size > currentMaxFileSize) errors.push("FILE_TOO_LARGE");
      if (file.size < currentMinFileSize) errors.push("FILE_TOO_SMALL");
      const customErrors = currentValidate?.(file);
      if (customErrors) errors.push(...customErrors);

      if (errors.length > 0) {
        rejected.push({ file, errors });
      } else {
        accepted.push(file);
        addedCount += 1;
      }
    }
    return { accepted, rejected };
  }, []);

  const setFileEntries = React.useCallback(
    (files: NativeFile[]) => {
      const currentOptions = optionsRef.current;
      if (currentOptions.disabled || currentOptions.readOnly) return;

      const { accepted, rejected } = validateFiles(files);
      const acceptedEntries: AttachmentFileEntry[] = accepted.map((file) => ({
        id: `attachment-${Date.now()}-${++idCounterRef.current}`,
        file,
        status: "pending",
      }));

      if (acceptedEntries.length > 0) {
        const acceptedForCallback =
          currentOptions.maxFiles > 1 ? acceptedEntries : [acceptedEntries[0]];
        const nextEntries =
          currentOptions.maxFiles > 1
            ? [...entriesRef.current, ...acceptedEntries]
            : acceptedForCallback;
        entriesRef.current = nextEntries;
        setAcceptedFileEntries(nextEntries);
        currentOptions.onFileAccept?.(acceptedForCallback, { updateFileEntryStatus });
      }
      if (rejected.length > 0) currentOptions.onFileReject?.(rejected);
    },
    [setAcceptedFileEntries, updateFileEntryStatus, validateFiles],
  );

  const openFilePicker = React.useCallback(() => {
    const currentOptions = optionsRef.current;
    if (
      currentOptions.disabled ||
      currentOptions.readOnly ||
      entriesRef.current.length >= currentOptions.maxFiles
    ) {
      return;
    }
    const picker = currentOptions.onSelectFiles;
    if (!picker) return;

    const requestId = ++pickerRequestRef.current;
    let result: NativeFile[] | Promise<NativeFile[]>;
    try {
      result = picker();
    } catch (error) {
      currentOptions.onSelectError?.(error);
      return;
    }

    Promise.resolve(result)
      .then((files) => {
        if (!mountedRef.current || requestId !== pickerRequestRef.current) return;
        if (!Array.isArray(files) || files.length === 0) return;
        if (optionsRef.current.disabled || optionsRef.current.readOnly) return;
        setFileEntries(files);
      })
      .catch((error) => {
        if (mountedRef.current && requestId === pickerRequestRef.current) {
          optionsRef.current.onSelectError?.(error);
        }
      });
  }, [setFileEntries]);

  const removeFileEntry = React.useCallback(
    (id: string) => {
      if (optionsRef.current.readOnly) return;
      const next = entriesRef.current.filter((entry) => entry.id !== id);
      entriesRef.current = next;
      setAcceptedFileEntries(next);
    },
    [setAcceptedFileEntries],
  );

  const clearFileEntries = React.useCallback(() => {
    if (optionsRef.current.readOnly) return;
    entriesRef.current = [];
    setAcceptedFileEntries([]);
  }, [setAcceptedFileEntries]);

  const reorderFileEntry = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      if (optionsRef.current.disabled || optionsRef.current.readOnly) return;
      const currentEntries = entriesRef.current;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= currentEntries.length ||
        toIndex >= currentEntries.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const next = [...currentEntries];
      const [entry] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, entry);
      entriesRef.current = next;
      setAcceptedFileEntries(next);
    },
    [setAcceptedFileEntries],
  );

  const stateProps = {
    "data-disabled": triggerDisabled,
    "data-readonly": readOnly,
    "data-invalid": invalid,
    "data-required": required,
  };

  return {
    ...props,
    acceptedFileEntries: entries,
    currentFileEntryCount: entries.length,
    acceptType,
    multiple,
    maxFiles,
    disabled,
    required,
    invalid,
    readOnly,
    triggerDisabled,
    stateProps,
    openFilePicker,
    setFileEntries,
    updateFileEntryStatus,
    removeFileEntry,
    clearFileEntries,
    reorderFileEntry,
  };
}

export interface AttachmentInputRootProps
  extends AttachmentInputProps,
    AttachmentInputVariantProps,
    LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputRoot = React.forwardRef<NodesRef, AttachmentInputRootProps>(
  (props, forwardedRef) => {
    const [variantProps, otherProps] = attachmentInput.splitVariantProps(props);
    const {
      children,
      className,
      acceptedFileEntries,
      defaultAcceptedFileEntries,
      onAcceptedFileEntriesChange,
      onFileReject,
      onFileAccept,
      accept,
      disabled,
      required,
      invalid,
      readOnly,
      maxFiles,
      maxFileSize,
      minFileSize,
      validate,
      onSelectFiles,
      onSelectError,
    } = otherProps;
    const api = useAttachmentInput({
      acceptedFileEntries,
      defaultAcceptedFileEntries,
      onAcceptedFileEntriesChange,
      onFileReject,
      onFileAccept,
      accept,
      disabled,
      required,
      invalid,
      readOnly,
      maxFiles,
      maxFileSize,
      minFileSize,
      validate,
      onSelectFiles,
      onSelectError,
    });
    const classes = attachmentInput(variantProps);

    return (
      <AttachmentInputContextObject.Provider value={api}>
        <rootRecipe.ClassNamesProvider value={classes}>
          <view
            {...mergeProps(
              forwardedRef ? { ref: forwardedRef } : {},
              api.stateProps,
              pickNativeViewProps(props),
            )}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </rootRecipe.ClassNamesProvider>
      </AttachmentInputContextObject.Provider>
    );
  },
);
AttachmentInputRoot.displayName = "AttachmentInputRoot";

export interface AttachmentInputContainerProps
  extends LynxStyledElementProps,
    Omit<NativeScrollViewProps, "scroll-orientation" | "scroll-bar-enable"> {}

export const AttachmentInputContainer = React.forwardRef<NodesRef, AttachmentInputContainerProps>(
  ({ children, className, ...nativeProps }, forwardedRef) => {
    const classes = rootRecipe.useClassNames();
    return (
      <scroll-view
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        scroll-orientation="horizontal"
        scroll-bar-enable={false}
        className={clsx(classes.container, className)}
      >
        <view className={classes.containerContent}>{children}</view>
      </scroll-view>
    );
  },
);
AttachmentInputContainer.displayName = "AttachmentInputContainer";

export interface AttachmentInputItemGroupProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputItemGroup = React.forwardRef<NodesRef, AttachmentInputItemGroupProps>(
  ({ children, className, ...nativeProps }, forwardedRef) => {
    const classes = rootRecipe.useClassNames();
    return (
      <view
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        className={clsx(classes.itemGroup, className)}
      >
        {children}
      </view>
    );
  },
);
AttachmentInputItemGroup.displayName = "AttachmentInputItemGroup";

export interface AttachmentInputTriggerProps
  extends AttachmentInputTriggerVariantProps,
    LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap">,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const AttachmentInputTrigger = React.forwardRef<NodesRef, AttachmentInputTriggerProps>(
  (props, forwardedRef) => {
    const [variantProps, restProps] = attachmentInputTrigger.splitVariantProps(props);
    const {
      children,
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = restProps;
    const context = useAttachmentInputContext();
    const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } =
      usePressTap({
        disabled: context.triggerDisabled,
        onTap: (event) => {
          context.openFilePicker();
          bindtap?.(event);
        },
        mainThreadOnTap: mainThreadBindtap,
      });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: context.triggerDisabled,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const classes = attachmentInputTrigger({
      ...variantProps,
      pressed,
      disabled: context.triggerDisabled,
    });

    return (
      <triggerRecipe.ClassNamesProvider value={classes}>
        <view
          {...mergeProps(
            forwardedRef ? { ref: forwardedRef } : {},
            pressHandlers,
            scaleFeedbackTriggerProps,
            nativeProps,
            scaleFeedbackTargetProps,
          )}
          accessibility-element={accessibilityElement}
          accessibility-traits={
            accessibilityTraits ?? (context.triggerDisabled ? "disabled" : "button")
          }
          className={clsx(classes.root, className)}
        >
          {children}
        </view>
      </triggerRecipe.ClassNamesProvider>
    );
  },
);
AttachmentInputTrigger.displayName = "AttachmentInputTrigger";

export interface AttachmentInputTriggerIconProps extends LynxStyledElementProps {
  image?: React.ReactNode;
  general?: React.ReactNode;
}

export const AttachmentInputTriggerIcon = React.forwardRef<
  NodesRef,
  AttachmentInputTriggerIconProps
>(({ image, general, children, className, ...nativeProps }, forwardedRef) => {
  const context = useAttachmentInputContext();
  const classes = attachmentInputTrigger({ pressed: false, disabled: context.triggerDisabled });
  const icon = context.acceptType === "image" ? (image ?? children) : (general ?? children);
  if (!React.isValidElement<LynxIconElementProps>(icon)) return null;

  return (
    <triggerRecipe.ClassNamesProvider value={classes}>
      <InternalIcon
        icon={icon}
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        className={clsx(classes.icon, className)}
      />
    </triggerRecipe.ClassNamesProvider>
  );
});
AttachmentInputTriggerIcon.displayName = "AttachmentInputTriggerIcon";

export interface AttachmentInputTriggerItemCountProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputTriggerItemCount = React.forwardRef<
  NodesRef,
  AttachmentInputTriggerItemCountProps
>(({ children, className, ...nativeProps }, forwardedRef) => {
  const context = useAttachmentInputContext();
  const classes = attachmentInputTrigger({ pressed: false, disabled: context.triggerDisabled });
  return (
    <triggerRecipe.ClassNamesProvider value={classes}>
      <view
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        className={clsx(classes.itemCountArea, className)}
      >
        <text className={classes.itemCount}>{context.currentFileEntryCount}</text>
        <text className={classes.maxItemCount}>/{context.maxFiles}</text>
        {children}
      </view>
    </triggerRecipe.ClassNamesProvider>
  );
});
AttachmentInputTriggerItemCount.displayName = "AttachmentInputTriggerItemCount";

export interface AttachmentInputItemProps
  extends Omit<AttachmentInputItemVariantProps, "removePressed">,
    LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {
  fileEntry: AttachmentFileEntry;
}

export const AttachmentInputItem = React.forwardRef<NodesRef, AttachmentInputItemProps>(
  ({ fileEntry, children, className, ...props }, forwardedRef) => {
    const root = useAttachmentInputContext();
    const [variantProps] = attachmentInputItem.splitVariantProps(props);
    const type = variantProps.type ?? root.acceptType ?? "general";
    const classes = attachmentInputItem({
      ...variantProps,
      type,
      disabled: root.disabled,
      readOnly: root.readOnly,
      pressed: false,
      dragging: variantProps.dragging ?? false,
    });
    const imageSource = fileEntry.file.previewUrl ?? fileEntry.file.uri;
    const itemContext: AttachmentInputItemContextValue = {
      ...fileEntry,
      imageProps:
        type === "image" && imageSource
          ? { src: imageSource, alt: fileEntry.file.name }
          : undefined,
      removeButtonProps: {
        bindtap: () => {
          if (!root.readOnly) root.removeFileEntry(fileEntry.id);
        },
      },
    };

    return (
      <AttachmentInputItemContextObject.Provider value={itemContext}>
        <itemRecipe.ClassNamesProvider value={classes}>
          <view
            {...mergeProps(
              forwardedRef ? { ref: forwardedRef } : {},
              root.stateProps,
              pickNativeViewProps(props),
            )}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </itemRecipe.ClassNamesProvider>
      </AttachmentInputItemContextObject.Provider>
    );
  },
);
AttachmentInputItem.displayName = "AttachmentInputItem";

export interface AttachmentInputItemNameProps
  extends LynxStyledElementProps,
    Omit<NativeTextElementProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputItemName = React.forwardRef<NodesRef, AttachmentInputItemNameProps>(
  ({ children, className, ...nativeProps }, forwardedRef) => {
    const item = useAttachmentInputItemContext();
    const classes = itemRecipe.useClassNames();
    return (
      <text
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        text-maxline="1"
        className={clsx(classes.name, className)}
      >
        {children ?? item.file.name}
      </text>
    );
  },
);
AttachmentInputItemName.displayName = "AttachmentInputItemName";

export interface AttachmentInputItemSizeProps
  extends LynxStyledElementProps,
    Omit<NativeTextElementProps, "bindtap" | "main-thread:bindtap"> {
  formatBytes?: (bytes: number) => string;
}

export const AttachmentInputItemSize = React.forwardRef<NodesRef, AttachmentInputItemSizeProps>(
  ({ children, className, formatBytes = formatFileSize, ...nativeProps }, forwardedRef) => {
    const item = useAttachmentInputItemContext();
    const classes = itemRecipe.useClassNames();
    return (
      <text
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        className={clsx(classes.size, className)}
      >
        {children ?? formatBytes(item.file.size)}
      </text>
    );
  },
);
AttachmentInputItemSize.displayName = "AttachmentInputItemSize";

export const AttachmentInputItemSurface = React.forwardRef<
  NodesRef,
  AttachmentInputItemSurfaceProps
>(({ children, className, ...nativeProps }, forwardedRef) => {
  const classes = itemRecipe.useClassNames();
  return (
    <view
      {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
      className={clsx(classes.surface, className)}
    >
      {children}
    </view>
  );
});
export interface AttachmentInputItemSurfaceProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}
AttachmentInputItemSurface.displayName = "AttachmentInputItemSurface";

export interface AttachmentInputItemImageProps extends LynxStyledElementProps, NativeImageProps {}

export const AttachmentInputItemImage = React.forwardRef<NodesRef, AttachmentInputItemImageProps>(
  ({ className, "accessibility-label": accessibilityLabel, ...nativeProps }, forwardedRef) => {
    const item = useAttachmentInputItemContext();
    const classes = itemRecipe.useClassNames();
    if (!item.imageProps) return null;
    return (
      <image
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        src={item.imageProps.src}
        accessibility-label={accessibilityLabel ?? item.imageProps.alt}
        className={clsx(classes.image, className)}
      />
    );
  },
);
AttachmentInputItemImage.displayName = "AttachmentInputItemImage";

export interface AttachmentInputItemThumbnailProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputItemThumbnail = React.forwardRef<
  NodesRef,
  AttachmentInputItemThumbnailProps
>(({ children, className, ...nativeProps }, forwardedRef) => {
  const classes = itemRecipe.useClassNames();
  return (
    <view
      {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
      className={clsx(classes.thumbnail, className)}
    >
      <IconSlotProvider value={{ classNames: { icon: classes.thumbnailIcon } }}>
        {children}
      </IconSlotProvider>
    </view>
  );
});
AttachmentInputItemThumbnail.displayName = "AttachmentInputItemThumbnail";

export interface AttachmentInputItemMetadataProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputItemMetadata = React.forwardRef<
  NodesRef,
  AttachmentInputItemMetadataProps
>(({ children, className, ...nativeProps }, forwardedRef) => {
  const classes = itemRecipe.useClassNames();
  return (
    <view
      {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
      className={clsx(classes.metadata, className)}
    >
      {children}
    </view>
  );
});
AttachmentInputItemMetadata.displayName = "AttachmentInputItemMetadata";

export interface AttachmentInputItemBadgeProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputItemBadge = React.forwardRef<NodesRef, AttachmentInputItemBadgeProps>(
  ({ children, className, ...nativeProps }, forwardedRef) => {
    const classes = itemRecipe.useClassNames();
    return (
      <view
        {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
        className={clsx(classes.badge, className)}
      >
        <text className={classes.badgeLabel}>{children}</text>
      </view>
    );
  },
);
AttachmentInputItemBadge.displayName = "AttachmentInputItemBadge";

export interface AttachmentInputItemActionButtonProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap">,
    LynxPressableProps {}

export const AttachmentInputItemActionButton = React.forwardRef<
  NodesRef,
  AttachmentInputItemActionButtonProps
>(
  (
    { children, className, bindtap, "main-thread:bindtap": mainThreadBindtap, ...nativeProps },
    forwardedRef,
  ) => {
    const context = useAttachmentInputContext();
    const classes = itemRecipe.useClassNames();
    const {
      pressed: _pressed,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      ...pressHandlers
    } = usePressTap({
      disabled: context.disabled || context.readOnly,
      onTap: bindtap,
      mainThreadOnTap: mainThreadBindtap,
    });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: context.disabled || context.readOnly,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const actionChildren = toArray(children).map((child: React.ReactNode) => {
      if (typeof child === "string" || typeof child === "number") {
        return <text className={classes.actionLabel}>{child}</text>;
      }
      return child;
    });

    return (
      <view
        {...mergeProps(
          forwardedRef ? { ref: forwardedRef } : {},
          pressHandlers,
          scaleFeedbackTriggerProps,
          nativeProps,
          scaleFeedbackTargetProps,
        )}
        className={clsx(classes.actionButton, className)}
      >
        <IconSlotProvider value={{ classNames: { icon: classes.actionIcon } }}>
          {actionChildren}
        </IconSlotProvider>
      </view>
    );
  },
);
AttachmentInputItemActionButton.displayName = "AttachmentInputItemActionButton";

export interface AttachmentInputItemBackdropProps
  extends Omit<LynxStyledElementProps, "children">,
    Omit<NativeViewProps, "children" | "bindtap" | "main-thread:bindtap"> {
  status: AttachmentFileEntry["status"];
  children?: React.ReactNode | ((entry: AttachmentFileEntry) => React.ReactNode);
}

export const AttachmentInputItemBackdrop = React.forwardRef<
  NodesRef,
  AttachmentInputItemBackdropProps
>(({ status, children, className, ...nativeProps }, forwardedRef) => {
  const entry = useAttachmentInputItemContext();
  const classes = itemRecipe.useClassNames();
  if (entry.status !== status) return null;
  return (
    <view
      {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps)}
      className={clsx(classes.backdrop, className)}
    >
      {typeof children === "function" ? children(entry) : children}
    </view>
  );
});
AttachmentInputItemBackdrop.displayName = "AttachmentInputItemBackdrop";

export interface AttachmentInputItemRemoveButtonProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap">,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const AttachmentInputItemRemoveButton = React.forwardRef<
  NodesRef,
  AttachmentInputItemRemoveButtonProps
>((props, forwardedRef) => {
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const item = useAttachmentInputItemContext();
  const context = useAttachmentInputContext();
  const nonInteractive = context.disabled || context.readOnly;
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    disabled: context.disabled || context.readOnly,
    onTap: (event) => {
      context.removeFileEntry(item.id);
      bindtap?.(event);
    },
    mainThreadOnTap: mainThreadBindtap,
  });
  const classes = itemRecipe.useClassNames();

  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: nonInteractive,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const feedbackClasses = attachmentInputItem({
    disabled: context.disabled,
    readOnly: context.readOnly,
    removePressed: pressed,
  });

  return (
    <view
      {...mergeProps(
        forwardedRef ? { ref: forwardedRef } : {},
        pressHandlers,
        scaleFeedbackTriggerProps,
        nativeProps,
        scaleFeedbackTargetProps,
      )}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits ?? (nonInteractive ? "disabled" : "button")}
      className={clsx(classes.removeButton, feedbackClasses.removeButton, className)}
    >
      <IconSlotProvider value={{ classNames: { icon: classes.removeIcon } }}>
        {children}
      </IconSlotProvider>
    </view>
  );
});
AttachmentInputItemRemoveButton.displayName = "AttachmentInputItemRemoveButton";

export interface AttachmentInputContextProps {
  children: (context: AttachmentInputContextValue) => React.ReactNode;
}

export const AttachmentInputContext = ({ children }: AttachmentInputContextProps) =>
  children(useAttachmentInputContext());

export const AttachmentInput = {
  Root: AttachmentInputRoot,
  Container: AttachmentInputContainer,
  ItemGroup: AttachmentInputItemGroup,
  Trigger: AttachmentInputTrigger,
  TriggerIcon: AttachmentInputTriggerIcon,
  TriggerItemCount: AttachmentInputTriggerItemCount,
  Item: AttachmentInputItem,
  ItemName: AttachmentInputItemName,
  ItemSize: AttachmentInputItemSize,
  ItemImage: AttachmentInputItemImage,
  ItemThumbnail: AttachmentInputItemThumbnail,
  ItemMetadata: AttachmentInputItemMetadata,
  ItemBadge: AttachmentInputItemBadge,
  ItemActionButton: AttachmentInputItemActionButton,
  ItemBackdrop: AttachmentInputItemBackdrop,
  ItemRemoveButton: AttachmentInputItemRemoveButton,
  ItemSurface: AttachmentInputItemSurface,
  Context: AttachmentInputContext,
};
