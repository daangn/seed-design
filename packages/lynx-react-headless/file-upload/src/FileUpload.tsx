import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import type { FileEntry } from "./types.js";
import { useFileUpload, type UseFileUploadProps } from "./useFileUpload.js";
import {
  FileUploadProvider,
  useFileUploadContext,
  useFileUploadItemContext,
  type UseFileUploadContext,
} from "./useFileUploadContext.js";
import { useFileUploadTrigger, type UseFileUploadTriggerProps } from "./useFileUploadTrigger.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];
type ImageProps = IntrinsicElements["image"];
type TouchEvent = Parameters<NonNullable<ViewProps["bindtouchstart"]>>[0];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${Number.parseFloat((bytes / 1024 ** index).toFixed(1))} ${units[index]}`;
}

export interface FileUploadRootProps
  extends UseFileUploadProps,
    Omit<ViewProps, keyof UseFileUploadProps> {}

/**
 * 스타일 없이 첨부 상태를 하위 요소에 제공하는 native `<view>`입니다.
 * `data-disabled`·`data-readonly`·`data-invalid`·`data-required`를 붙이며 사용자 props가 우선합니다.
 */
export const FileUploadRoot = React.forwardRef<NodesRef, FileUploadRootProps>((props, ref) => {
  const {
    children,
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
    ...nativeProps
  } = props;
  const api = useFileUpload({
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

  return (
    <FileUploadProvider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...api.stateProps} {...nativeProps}>
        {children}
      </view>
    </FileUploadProvider>
  );
});
FileUploadRoot.displayName = "FileUploadRoot";

export interface FileUploadTriggerProps
  extends UseFileUploadTriggerProps,
    Omit<ViewProps, keyof UseFileUploadTriggerProps> {}

/**
 * 스타일 없이 파일 선택을 시작하는 native `<view>`입니다. tap하면 Root의 `onSelectFiles`를 호출합니다.
 * 눌림 상태가 필요하면 `useFileUploadTrigger`로 직접 조립합니다.
 */
export const FileUploadTrigger = React.forwardRef<NodesRef, FileUploadTriggerProps>(
  (props, ref) => {
    const {
      children,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      ...nativeProps
    } = props;
    const { triggerProps } = useFileUploadTrigger({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
    });
    const {
      bindtouchstart: pressStart,
      bindtouchend: pressEnd,
      bindtouchcancel: pressCancel,
    } = triggerProps;

    return (
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...triggerProps}
        bindtouchstart={(event: TouchEvent) => {
          bindtouchstart?.(event);
          pressStart(event);
        }}
        bindtouchend={(event: TouchEvent) => {
          bindtouchend?.(event);
          pressEnd(event);
        }}
        bindtouchcancel={(event: TouchEvent) => {
          bindtouchcancel?.(event);
          pressCancel(event);
        }}
      >
        {children}
      </view>
    );
  },
);
FileUploadTrigger.displayName = "FileUploadTrigger";

export interface FileUploadItemNameProps extends TextProps {}

/** 파일 이름을 표시하는 무스타일 native `<text>`입니다. `children`을 주면 이름 대신 렌더링합니다. */
export const FileUploadItemName = React.forwardRef<NodesRef, FileUploadItemNameProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    const { file } = useFileUploadItemContext();

    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children ?? file.name}
      </text>
    );
  },
);
FileUploadItemName.displayName = "FileUploadItemName";

export interface FileUploadItemSizeProps extends TextProps {
  /**
   * bytes를 표시 문자열로 바꿉니다.
   * @default 1024 단위 `B`·`KB`·`MB`·`GB`·`TB`, 소수점 한 자리
   */
  formatBytes?: (bytes: number) => string;
}

/** 파일 크기를 표시하는 무스타일 native `<text>`입니다. `children`을 주면 크기 대신 렌더링합니다. */
export const FileUploadItemSize = React.forwardRef<NodesRef, FileUploadItemSizeProps>(
  (props, ref) => {
    const { children, formatBytes = formatFileSize, ...nativeProps } = props;
    const { file } = useFileUploadItemContext();

    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children ?? formatBytes(file.size)}
      </text>
    );
  },
);
FileUploadItemSize.displayName = "FileUploadItemSize";

export interface FileUploadItemImageProps extends Omit<ImageProps, "src" | "children"> {}

/**
 * 이미지 미리보기를 표시하는 무스타일 native `<image>`입니다. item에 `imageProps`가 없으면 렌더링하지 않습니다.
 * `accessibility-label`을 주지 않으면 파일 이름을 사용합니다.
 */
export const FileUploadItemImage = React.forwardRef<NodesRef, FileUploadItemImageProps>(
  (props, ref) => {
    const { "accessibility-label": accessibilityLabel, ...nativeProps } = props;
    const { imageProps } = useFileUploadItemContext();
    if (!imageProps) return null;

    return (
      <image
        {...(ref ? { ref: ref as ImageProps["ref"] } : {})}
        src={imageProps.src}
        accessibility-label={accessibilityLabel ?? imageProps.alt}
        {...nativeProps}
      />
    );
  },
);
FileUploadItemImage.displayName = "FileUploadItemImage";

export interface FileUploadItemBackdropProps extends Omit<ViewProps, "children"> {
  /** item 상태가 이 값일 때만 렌더링합니다. */
  status: FileEntry["status"];
  children?: React.ReactNode | ((entry: FileEntry) => React.ReactNode);
}

/** item 상태가 `status`와 같을 때만 렌더링하는 무스타일 native `<view>`입니다. */
export const FileUploadItemBackdrop = React.forwardRef<NodesRef, FileUploadItemBackdropProps>(
  (props, ref) => {
    const { status, children, ...nativeProps } = props;
    const entry = useFileUploadItemContext();
    if (entry.status !== status) return null;

    return (
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {typeof children === "function" ? children(entry) : children}
      </view>
    );
  },
);
FileUploadItemBackdrop.displayName = "FileUploadItemBackdrop";

export interface FileUploadItemRemoveButtonProps extends ViewProps {}

/**
 * 스타일 없이 item을 삭제하는 native `<view>`입니다. Root가 `readOnly`이면 tap을 막고
 * `accessibility-traits`를 따로 주지 않으면 `"disabled"`로 알립니다. `disabled`에서는 삭제합니다.
 */
export const FileUploadItemRemoveButton = React.forwardRef<
  NodesRef,
  FileUploadItemRemoveButtonProps
>((props, ref) => {
  const {
    children,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const { id } = useFileUploadItemContext();
  const { readOnly, removeFileEntry } = useFileUploadContext();
  const {
    pressed: _pressed,
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...pressProps
  } = usePressTap({
    disabled: readOnly,
    onTap: (event) => {
      removeFileEntry(id);
      bindtap?.(event);
    },
    mainThreadOnTap: mainThreadBindtap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits ?? (readOnly ? "disabled" : "button")}
      {...nativeProps}
      {...pressProps}
      bindtouchstart={(event: TouchEvent) => {
        bindtouchstart?.(event);
        pressStart(event);
      }}
      bindtouchend={(event: TouchEvent) => {
        bindtouchend?.(event);
        pressEnd(event);
      }}
      bindtouchcancel={(event: TouchEvent) => {
        bindtouchcancel?.(event);
        pressCancel(event);
      }}
    >
      {children}
    </view>
  );
});
FileUploadItemRemoveButton.displayName = "FileUploadItemRemoveButton";

export interface FileUploadContextProps {
  children: (context: UseFileUploadContext) => React.ReactNode;
}

/** Root 상태를 render prop으로 읽습니다. */
export const FileUploadContext = ({ children }: FileUploadContextProps) =>
  children(useFileUploadContext());
