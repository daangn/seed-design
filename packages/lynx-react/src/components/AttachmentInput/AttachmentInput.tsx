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
import { useFieldContext } from "@seed-design/lynx-react-field";
import {
  FileUploadContext,
  FileUploadItemBackdrop,
  FileUploadItemImage,
  FileUploadItemName,
  FileUploadItemProvider,
  FileUploadItemRemoveButton,
  FileUploadItemSize,
  FileUploadRoot,
  useFileUpload,
  useFileUploadContext,
  useFileUploadItem,
  useFileUploadTrigger,
  type FileEntry,
  type FileUploadContextProps,
  type UseFileUploadContext,
  type UseFileUploadProps,
  type UseFileUploadStateProps,
} from "@seed-design/lynx-react-file-upload";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextProps,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import { toArray } from "../../utils/children";
import clsx from "clsx";
import { IconSlotProvider, InternalIcon } from "../Icon/Icon";

export {
  useFileUploadContext as useAttachmentInputContext,
  useFileUploadItemContext as useAttachmentInputItemContext,
  type FileEntry as AttachmentFileEntry,
  type FileError as AttachmentFileError,
  type FileRejection as AttachmentFileRejection,
  type FileStatusDetails as AttachmentFileStatusDetails,
  type NativeFile,
} from "@seed-design/lynx-react-file-upload";

export type AttachmentInputStateProps = UseFileUploadStateProps;
export type AttachmentInputProps = UseFileUploadProps;
export type AttachmentInputContextValue = UseFileUploadContext;

const NATIVE_VIEW_PROP_KEYS = [
  "id",
  "flatten",
  "style",
  "accessibility-label",
  "accessibility-traits",
  "accessibility-element",
  "accessibility-value",
  "accessibility-role-description",
  "accessibility-elements-hidden",
  "accessibility-heading",
  "accessibility-actions",
  "accessibility-exclusive-focus",
  "ios-platform-accessibility-id",
] as const;
interface NativeViewProps
  extends LynxAccessibilityProps,
    Pick<IntrinsicElements["view"], "id" | "flatten"> {}
type PickedNativeViewProps = Pick<
  LynxStyledElementProps & NativeViewProps,
  (typeof NATIVE_VIEW_PROP_KEYS)[number]
>;
function pickNativeViewProps(props: LynxStyledElementProps & NativeViewProps) {
  const picked: Partial<Record<keyof PickedNativeViewProps, unknown>> = {};
  for (const key of NATIVE_VIEW_PROP_KEYS) {
    if (props[key] !== undefined) picked[key] = props[key];
  }
  // 모든 key가 optional이고 같은 key의 props 값만 복사하므로 형태가 보존된다.
  return picked as PickedNativeViewProps;
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

/** 명시한 상태 props를 먼저 쓰고, 생략한 값만 감싼 Field 상태를 사용합니다. */
function useFieldStateFallback(
  props: Pick<AttachmentInputProps, "disabled" | "required" | "invalid" | "readOnly">,
) {
  const fieldContext = useFieldContext({ strict: false });
  return {
    disabled: props.disabled ?? fieldContext?.disabled ?? false,
    required: props.required ?? fieldContext?.required ?? false,
    invalid: props.invalid ?? fieldContext?.invalid ?? false,
    readOnly: props.readOnly ?? fieldContext?.readOnly ?? false,
  };
}

/**
 * `@seed-design/lynx-react-file-upload`의 `useFileUpload`에 Field 상태 fallback을 더합니다.
 * 명시한 `disabled`·`required`·`invalid`·`readOnly`가 Field 값보다 우선합니다.
 */
export function useAttachmentInput(props: AttachmentInputProps = {}): AttachmentInputContextValue {
  return useFileUpload({ ...props, ...useFieldStateFallback(props) });
}

export interface AttachmentInputRootProps
  extends AttachmentInputProps,
    AttachmentInputVariantProps,
    LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

/**
 * `@seed-design/lynx-react-file-upload`의 `FileUploadRoot`에 SEED recipe를 조립합니다.
 * 명시한 `disabled`·`required`·`invalid`·`readOnly`가 감싼 Field 상태보다 우선합니다.
 */
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
      maxFiles,
      maxFileSize,
      minFileSize,
      validate,
      onSelectFiles,
      onSelectError,
    } = otherProps;
    const fieldState = useFieldStateFallback(otherProps);
    const classes = attachmentInput(variantProps);

    return (
      <rootRecipe.ClassNamesProvider value={classes}>
        <FileUploadRoot
          ref={forwardedRef}
          acceptedFileEntries={acceptedFileEntries}
          defaultAcceptedFileEntries={defaultAcceptedFileEntries}
          onAcceptedFileEntriesChange={onAcceptedFileEntriesChange}
          onFileReject={onFileReject}
          onFileAccept={onFileAccept}
          accept={accept}
          maxFiles={maxFiles}
          maxFileSize={maxFileSize}
          minFileSize={minFileSize}
          validate={validate}
          onSelectFiles={onSelectFiles}
          onSelectError={onSelectError}
          {...fieldState}
          {...pickNativeViewProps(props)}
          className={clsx(classes.root, className)}
        >
          {children}
        </FileUploadRoot>
      </rootRecipe.ClassNamesProvider>
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

/**
 * `useFileUploadTrigger`의 파일 선택·눌림 상태·접근성 위에 SEED recipe를 조립합니다.
 */
export const AttachmentInputTrigger = React.forwardRef<NodesRef, AttachmentInputTriggerProps>(
  (props, forwardedRef) => {
    const [variantProps, restProps] = attachmentInputTrigger.splitVariantProps(props);
    const {
      children,
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = restProps;
    const trigger = useFileUploadTrigger({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
    });
    const classes = attachmentInputTrigger({
      ...variantProps,
      pressed: trigger.pressed,
      disabled: trigger.disabled,
    });

    return (
      <triggerRecipe.ClassNamesProvider value={classes}>
        <view
          {...mergeProps(
            forwardedRef ? { ref: forwardedRef } : {},
            trigger.triggerProps,
            nativeProps,
          )}
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
  const context = useFileUploadContext();
  const classes = attachmentInputTrigger({ pressed: false, disabled: context.triggerDisabled });
  const icon = context.acceptType === "image" ? (image ?? children) : (general ?? children);
  if (!React.isValidElement<LynxIconElementProps>(icon)) return null;

  return (
    <triggerRecipe.ClassNamesProvider value={classes}>
      <InternalIcon
        icon={icon}
        {...mergeProps(
          { "accessibility-elements-hidden": true },
          forwardedRef ? { ref: forwardedRef } : {},
          nativeProps,
        )}
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
  const context = useFileUploadContext();
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
  extends AttachmentInputItemVariantProps,
    LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {
  fileEntry: FileEntry;
}

/**
 * `useFileUploadItem`으로 item 상태를 내려 주고 SEED recipe를 조립합니다.
 * `type`을 주지 않으면 Root의 `acceptType`을 따르며 `"image"`일 때만 미리보기를 만듭니다.
 */
export const AttachmentInputItem = React.forwardRef<NodesRef, AttachmentInputItemProps>(
  ({ fileEntry, children, className, ...props }, forwardedRef) => {
    const root = useFileUploadContext();
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
    const item = useFileUploadItem(fileEntry, { imagePreview: type === "image" });

    return (
      <FileUploadItemProvider value={item}>
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
      </FileUploadItemProvider>
    );
  },
);
AttachmentInputItem.displayName = "AttachmentInputItem";

export interface AttachmentInputItemNameProps
  extends LynxStyledElementProps,
    Omit<NativeTextElementProps, "bindtap" | "main-thread:bindtap"> {}

export const AttachmentInputItemName = React.forwardRef<NodesRef, AttachmentInputItemNameProps>(
  ({ className, ...nativeProps }, forwardedRef) => {
    const classes = itemRecipe.useClassNames();
    return (
      <FileUploadItemName
        ref={forwardedRef}
        {...nativeProps}
        text-maxline="1"
        className={clsx(classes.name, className)}
      />
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
  ({ className, ...nativeProps }, forwardedRef) => {
    const classes = itemRecipe.useClassNames();
    return (
      <FileUploadItemSize
        ref={forwardedRef}
        {...nativeProps}
        className={clsx(classes.size, className)}
      />
    );
  },
);
AttachmentInputItemSize.displayName = "AttachmentInputItemSize";

export interface AttachmentInputItemSurfaceProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap"> {}

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
AttachmentInputItemSurface.displayName = "AttachmentInputItemSurface";

export interface AttachmentInputItemImageProps extends LynxStyledElementProps, NativeImageProps {}

export const AttachmentInputItemImage = React.forwardRef<NodesRef, AttachmentInputItemImageProps>(
  ({ className, ...nativeProps }, forwardedRef) => {
    const classes = itemRecipe.useClassNames();
    return (
      <FileUploadItemImage
        ref={forwardedRef}
        {...nativeProps}
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
>(({ children, className, bindtap, ...nativeProps }, forwardedRef) => {
  const classes = itemRecipe.useClassNames();
  const actionChildren = toArray(children).map((child: React.ReactNode) => {
    if (typeof child === "string" || typeof child === "number") {
      return <text className={classes.actionLabel}>{child}</text>;
    }
    return child;
  });

  return (
    <view
      {...mergeProps(forwardedRef ? { ref: forwardedRef } : {}, nativeProps, { bindtap })}
      className={clsx(classes.actionButton, className)}
    >
      <IconSlotProvider value={{ classNames: { icon: classes.actionIcon } }}>
        {actionChildren}
      </IconSlotProvider>
    </view>
  );
});
AttachmentInputItemActionButton.displayName = "AttachmentInputItemActionButton";

export interface AttachmentInputItemBackdropProps
  extends Omit<LynxStyledElementProps, "children">,
    Omit<NativeViewProps, "children" | "bindtap" | "main-thread:bindtap"> {
  status: FileEntry["status"];
  children?: React.ReactNode | ((entry: FileEntry) => React.ReactNode);
}

export const AttachmentInputItemBackdrop = React.forwardRef<
  NodesRef,
  AttachmentInputItemBackdropProps
>(({ className, ...props }, forwardedRef) => {
  const classes = itemRecipe.useClassNames();
  return (
    <FileUploadItemBackdrop
      ref={forwardedRef}
      {...props}
      className={clsx(classes.backdrop, className)}
    />
  );
});
AttachmentInputItemBackdrop.displayName = "AttachmentInputItemBackdrop";

export interface AttachmentInputItemRemoveButtonProps
  extends LynxStyledElementProps,
    Omit<NativeViewProps, "bindtap" | "main-thread:bindtap">,
    LynxPressableProps,
    LynxAccessibilityProps {}

/**
 * `FileUploadItemRemoveButton`의 삭제·`readOnly` 차단·접근성 위에 SEED recipe와 아이콘 slot을 조립합니다.
 */
export const AttachmentInputItemRemoveButton = React.forwardRef<
  NodesRef,
  AttachmentInputItemRemoveButtonProps
>(({ children, className, ...props }, forwardedRef) => {
  const classes = itemRecipe.useClassNames();
  const { readOnly } = useFileUploadContext();
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: readOnly,
  });

  return (
    <FileUploadItemRemoveButton
      {...mergeProps(
        forwardedRef ? { ref: forwardedRef } : {},
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        props,
      )}
      flatten={false}
      className={clsx(classes.removeButton, className)}
    >
      <IconSlotProvider value={{ classNames: { icon: classes.removeIcon } }}>
        {children}
      </IconSlotProvider>
    </FileUploadItemRemoveButton>
  );
});
AttachmentInputItemRemoveButton.displayName = "AttachmentInputItemRemoveButton";

export type AttachmentInputContextProps = FileUploadContextProps;

export const AttachmentInputContext = FileUploadContext;

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
