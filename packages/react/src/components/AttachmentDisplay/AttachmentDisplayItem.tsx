"use client";

import * as React from "react";
import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/css/recipes/attachment-input-item";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  AttachmentDisplayItemProvider,
  useAttachmentDisplayItemContext,
  type DisplayItemEntry,
} from "@seed-design/react-attachment-display";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { useClassNames, ClassNamesProvider, withContext } =
  createSlotRecipeContext(attachmentInputItem);

export interface AttachmentDisplayItemProps
  extends Omit<AttachmentInputItemVariantProps, "type">,
    PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  entry: DisplayItemEntry;
}

export const AttachmentDisplayItem = React.forwardRef<HTMLLIElement, AttachmentDisplayItemProps>(
  ({ className, entry, ...props }, ref) => {
    const [variantProps, otherProps] = attachmentInputItem.splitVariantProps({
      type: "image",
      ...props,
    });

    const classNames = attachmentInputItem(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <AttachmentDisplayItemProvider value={entry}>
          <Primitive.li ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
        </AttachmentDisplayItemProvider>
      </ClassNamesProvider>
    );
  },
);
AttachmentDisplayItem.displayName = "AttachmentDisplayItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const AttachmentDisplayItemImage = React.forwardRef<
  HTMLImageElement,
  AttachmentDisplayItemImageProps
>(({ className, alt, ...props }, ref) => {
  const { thumbnailUrl } = useAttachmentDisplayItemContext();
  const classNames = useClassNames();

  return (
    <Primitive.img
      ref={ref}
      src={thumbnailUrl}
      alt={alt ?? ""}
      className={clsx(classNames.image, className)}
      {...props}
    />
  );
});
AttachmentDisplayItemImage.displayName = "AttachmentDisplayItemImage";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemThumbnailProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  fallback?: React.ReactNode;
}

export const AttachmentDisplayItemThumbnail = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemThumbnailProps
>(({ fallback, className, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    <Primitive.div ref={ref} className={clsx(classNames.thumbnail, className)} {...props}>
      {fallback}
    </Primitive.div>
  );
});
AttachmentDisplayItemThumbnail.displayName = "AttachmentDisplayItemThumbnail";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemActionButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayItemActionButton = React.forwardRef<
  HTMLButtonElement,
  AttachmentDisplayItemActionButtonProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    <Primitive.button
      type="button"
      ref={ref}
      className={clsx(classNames.actionButton, className)}
      {...props}
    />
  );
});
AttachmentDisplayItemActionButton.displayName = "AttachmentDisplayItemActionButton";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemRemoveButtonProps
  extends AttachmentDisplayPrimitive.ItemRemoveButtonProps {}

export const AttachmentDisplayItemRemoveButton = withContext<
  HTMLButtonElement,
  AttachmentDisplayItemRemoveButtonProps
>(AttachmentDisplayPrimitive.ItemRemoveButton, "removeButton");

////////////////////////////////////////////////////////////////////////////////////

export type AttachmentDisplayItemPreviewProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  image?: React.ReactNode;

  overlay?: {
    pending?: React.ReactNode | (() => React.ReactNode);
    uploading?: React.ReactNode | ((props: { progress?: number }) => React.ReactNode);
    success?: React.ReactNode | (() => React.ReactNode);
    error?: React.ReactNode | (() => React.ReactNode);
  };
};

function resolveOverlayContent(
  overlay: AttachmentDisplayItemPreviewProps["overlay"],
  entry: DisplayItemEntry,
): React.ReactNode {
  if (!overlay) return undefined;

  const { pending, uploading, success, error } = overlay;

  switch (entry.status) {
    case "pending":
      return typeof pending === "function" ? pending() : pending;
    case "uploading": {
      if (uploading) {
        return typeof uploading === "function"
          ? uploading({ progress: entry.progress })
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

export const AttachmentDisplayItemPreview = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemPreviewProps
>(({ image, overlay, className, ...props }, ref) => {
  const entry = useAttachmentDisplayItemContext();
  const classNames = useClassNames();

  const overlayContent = resolveOverlayContent(overlay, entry);

  return (
    <>
      {image && (
        <Slot ref={ref} {...props}>
          {image}
        </Slot>
      )}
      {overlayContent && <div className={classNames.backdrop}>{overlayContent}</div>}
    </>
  );
});
AttachmentDisplayItemPreview.displayName = "AttachmentDisplayItemPreview";
