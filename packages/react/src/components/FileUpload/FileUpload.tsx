"use client";

import * as React from "react";
import { fileUpload, type FileUploadVariantProps } from "@seed-design/css/recipes/file-upload";
import {
  fileUploadItem,
  type FileUploadItemVariantProps,
} from "@seed-design/css/recipes/file-upload-item";
import {
  fileUploadTrigger,
  type FileUploadTriggerVariantProps,
} from "@seed-design/css/recipes/file-upload-trigger";
import {
  FileUpload as FileUploadPrimitive,
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItemContext,
  type FileAcceptType,
  type FileStatusDetails,
  type FileWithStatus,
  splitFileName,
} from "@seed-design/react-file-upload";
import { MiddleTruncate } from "@seed-design/react-middle-truncate";
import { useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import clsx from "clsx";
import { InternalIcon } from "../private/Icon";
import { Slot } from "@radix-ui/react-slot";
import {
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleRange,
  type ProgressCircleRootProps,
  type ProgressCircleTrackProps,
  type ProgressCircleRangeProps,
} from "../ProgressCircle/ProgressCircle";

const { withProvider, withContext } = createSlotRecipeContext(fileUpload);
const {
  useClassNames: useItemClassNames,
  ClassNamesProvider: ItemClassNamesProvider,
  withContext: withItemContext,
} = createSlotRecipeContext(fileUploadItem);
const { withProvider: withTriggerProvider, useClassNames: useTriggerClassNames } =
  createSlotRecipeContext(fileUploadTrigger);

const withStateProps = createWithStateProps([useFileUploadContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadRootProps
  extends FileUploadVariantProps,
    FileUploadPrimitive.RootProps {}

export const FileUploadRoot = withProvider<HTMLDivElement, FileUploadRootProps>(
  FileUploadPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadDropzoneProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadDropzone = withContext<HTMLDivElement, FileUploadDropzoneProps>(
  FileUploadPrimitive.Dropzone,
  "dropzone",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadContainer = withContext<HTMLDivElement, FileUploadContainerProps>(
  withStateProps(Primitive.div),
  "container",
);

export interface FileUploadTriggerProps
  extends FileUploadTriggerVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadTrigger = withTriggerProvider<HTMLButtonElement, FileUploadTriggerProps>(
  FileUploadPrimitive.Trigger,
  "root",
);

export type FileUploadTriggerIconProps = React.SVGAttributes<SVGElement> & {
  [K in NonNullable<FileAcceptType>]?: React.ReactNode;
} & {
  general: React.ReactNode;
};

export const FileUploadTriggerIcon = React.forwardRef<SVGSVGElement, FileUploadTriggerIconProps>(
  ({ image, general, ...props }, ref) => {
    const { acceptType, stateProps } = useFileUploadContext();
    const classNames = useTriggerClassNames();

    const mergedProps = mergeProps(
      stateProps,
      { className: classNames.icon },
      props as React.HTMLAttributes<HTMLElement>,
    );

    // 이거 Icon으로 교체. classNames가 불필요해질 수 있음 (onlyIcon으로 대체)

    if (acceptType === "image" && image) {
      return <InternalIcon svg={image} ref={ref} {...mergedProps} />;
    }

    return <InternalIcon svg={general} ref={ref} {...mergedProps} />;
  },
);

export interface FileUploadTriggerItemCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadTriggerItemCount = React.forwardRef<
  HTMLDivElement,
  FileUploadTriggerItemCountProps
>(({ className, ...otherProps }, ref) => {
  const classNames = useTriggerClassNames();
  const { currentFileCount, maxFiles, stateProps } = useFileUploadContext();

  return (
    <Primitive.div className={clsx(classNames.itemCount, className)} ref={ref} {...otherProps}>
      <span
        {...(currentFileCount === 0 && { "data-empty": true })}
        className={classNames.itemCount}
        {...stateProps}
      >
        {currentFileCount}
      </span>
      <span className={classNames.maxItemCount} {...stateProps}>
        /{maxFiles}
      </span>
    </Primitive.div>
  );
});

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadHiddenInputProps extends FileUploadPrimitive.HiddenInputProps {}

export const FileUploadHiddenInput = React.forwardRef<HTMLInputElement, FileUploadHiddenInputProps>(
  (props, ref) => {
    const fileUploadContext = useFileUploadContext();
    const fieldContext = useFieldContext({ strict: false });

    const mergedProps = mergeProps(
      fieldContext ? fieldContext.inputAriaAttributes : {},
      fileUploadContext.hiddenInputProps,
      fieldContext ? fieldContext.inputProps : {},
      props,
    );

    return <FileUploadPrimitive.HiddenInput ref={ref} {...mergedProps} />;
  },
);
FileUploadHiddenInput.displayName = "FileUploadHiddenInput";

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLUListElement> {}

export const FileUploadItemGroup = withContext<HTMLUListElement, FileUploadItemGroupProps>(
  withStateProps(Primitive.ul),
  "itemGroup",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemProps
  extends FileUploadItemVariantProps,
    PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  fileWithStatus: FileWithStatus;
}

export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  ({ className, fileWithStatus, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();

    const [variantProps, otherProps] = fileUploadItem.splitVariantProps({
      type: acceptType,
      ...props,
    });

    const classNames = fileUploadItem(variantProps);

    return (
      <ItemClassNamesProvider value={classNames}>
        <FileUploadItemProvider value={fileWithStatus}>
          <Primitive.li ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
        </FileUploadItemProvider>
      </ItemClassNamesProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemNameProps
  extends PrimitiveProps,
    FileUploadPrimitive.ItemNameProps {}

export const FileUploadItemName = React.forwardRef<HTMLSpanElement, FileUploadItemNameProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useItemClassNames();
    const { file } = useFileUploadItemContext();
    const { extension } = splitFileName(file.name);

    return (
      <FileUploadPrimitive.ItemName
        ref={ref}
        className={clsx(classNames.name, className)}
        {...props}
      >
        {children ?? (
          <MiddleTruncate end={extension.length} maxLines={2}>
            {file.name}
          </MiddleTruncate>
        )}
      </FileUploadPrimitive.ItemName>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemSizeProps extends FileUploadPrimitive.ItemSizeProps {}

export const FileUploadItemSize = React.forwardRef<HTMLSpanElement, FileUploadItemSizeProps>(
  ({ className, ...props }, ref) => {
    const classNames = useItemClassNames();

    return (
      <FileUploadPrimitive.ItemSize
        ref={ref}
        className={clsx(classNames.size, classNames)}
        {...props}
      />
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemRemoveButtonProps
  extends FileUploadPrimitive.ItemRemoveButtonProps {}

export const FileUploadItemRemoveButton = withItemContext<
  HTMLButtonElement,
  FileUploadItemRemoveButtonProps
>(FileUploadPrimitive.ItemRemoveButton, "removeButton");

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadContextProps extends FileUploadPrimitive.ContextProps {}

export const FileUploadContext = FileUploadPrimitive.Context;

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const FileUploadItemImage = React.forwardRef<HTMLImageElement, FileUploadItemImageProps>(
  ({ className, ...props }, ref) => {
    const { createFileUrl } = useFileUploadContext();
    const { file } = useFileUploadItemContext();

    const [src, setSrc] = React.useState<string>();

    const classNames = useItemClassNames();

    React.useEffect(() => {
      if (!file) return;

      return createFileUrl(file, setSrc);
    }, [file, createFileUrl]);

    if (!src) return null;

    return (
      <Primitive.img
        ref={ref}
        src={src}
        alt={file?.name} // file name as alt text is valid here
        className={clsx(classNames.image, className)}
        {...props}
      />
    );
  },
);

export interface FileUploadItemThumbnailProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  fallback?: React.ReactNode;
}

export const FileUploadItemThumbnail = React.forwardRef<
  HTMLDivElement,
  FileUploadItemThumbnailProps
>(({ fallback, className, ...props }, ref) => {
  const classNames = useItemClassNames();

  return (
    // when actual thumbnail implementation happens, Primitive.div will likely be replaced with FileUploadPrimitive.ItemThumbnail or something
    <Primitive.div ref={ref} className={clsx(classNames.thumbnail, className)} {...props}>
      {fallback}
    </Primitive.div>
  );
});

////////////////////////////////////////////////////////////////////////////////////

export type {
  FileStatusDetails,
  FileWithStatus,
  FileAcceptType,
} from "@seed-design/react-file-upload";

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemProgressCircleRootProps extends ProgressCircleRootProps {}

export const FileUploadItemProgressCircleRoot = React.forwardRef<
  SVGSVGElement,
  FileUploadItemProgressCircleRootProps
>((props, ref) => {
  const { acceptType } = useFileUploadContext();
  const tone = acceptType === "image" ? "staticWhite" : "neutral";

  return <ProgressCircleRoot ref={ref} tone={tone} size="24" {...props} />;
});
FileUploadItemProgressCircleRoot.displayName = "FileUploadItemProgressCircleRoot";

export interface FileUploadItemProgressCircleTrackProps extends ProgressCircleTrackProps {}

export const FileUploadItemProgressCircleTrack = ProgressCircleTrack;

export interface FileUploadItemProgressCircleRangeProps extends ProgressCircleRangeProps {}

export const FileUploadItemProgressCircleRange = ProgressCircleRange;

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemActionButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadItemActionButton = React.forwardRef<
  HTMLButtonElement,
  FileUploadItemActionButtonProps
>(({ className, ...props }, ref) => {
  const classNames = useItemClassNames();

  return (
    <Primitive.button
      type="button"
      ref={ref}
      className={clsx(classNames.actionButton, className)}
      {...props}
    />
  );
});

////////////////////////////////////////////////////////////////////////////////////

export type FileUploadItemPreviewProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  [K in NonNullable<FileAcceptType>]?: React.ReactNode;
} & {
  general: React.ReactNode;

  overlay?: {
    pending?: React.ReactNode | (() => React.ReactNode);
    uploading?: React.ReactNode | ((props: { progress?: number }) => React.ReactNode);
    success?: React.ReactNode | (() => React.ReactNode);
    error?: React.ReactNode | (() => React.ReactNode);
  };
};

function resolveOverlayContent(
  overlay: FileUploadItemPreviewProps["overlay"],
  details: FileStatusDetails,
): React.ReactNode {
  if (!overlay) return undefined;

  const { pending, uploading, success, error } = overlay;
  const { status } = details;

  switch (status) {
    case "pending":
      return typeof pending === "function" ? pending() : pending;
    case "uploading": {
      if (uploading) {
        return typeof uploading === "function"
          ? uploading({ progress: details.progress })
          : uploading;
      }
      return typeof pending === "function" ? pending() : pending;
    }
    case "success": {
      if (success) return typeof success === "function" ? success() : success;
      return typeof pending === "function" ? pending() : pending;
    }
    case "error": {
      if (error) return typeof error === "function" ? error() : error;
      return typeof pending === "function" ? pending() : pending;
    }
  }
}

export const FileUploadItemPreview = React.forwardRef<HTMLDivElement, FileUploadItemPreviewProps>(
  ({ image, general, overlay, className, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();
    const { details } = useFileUploadItemContext();
    const classNames = useItemClassNames();

    const overlayContent = resolveOverlayContent(overlay, details);

    if (acceptType === "image" && image) {
      return (
        <>
          <Slot ref={ref} {...props}>
            {image}
          </Slot>
          {overlayContent && <div className={classNames.backdrop}>{overlayContent}</div>}
        </>
      );
    }

    if (overlayContent) {
      return (
        <div className={classNames.backdrop} ref={ref} {...props}>
          {overlayContent}
        </div>
      );
    }

    return (
      <Slot ref={ref} {...props}>
        {general}
      </Slot>
    );
  },
);
FileUploadItemPreview.displayName = "FileUploadItemPreview";

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemMetadataProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadItemMetadata = React.forwardRef<HTMLDivElement, FileUploadItemMetadataProps>(
  ({ className, ...props }, ref) => {
    const classNames = useItemClassNames();

    return <Primitive.div ref={ref} className={clsx(classNames.metadata, className)} {...props} />;
  },
);
