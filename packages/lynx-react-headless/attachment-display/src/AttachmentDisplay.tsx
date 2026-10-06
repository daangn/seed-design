import * as React from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import type { DisplayItemEntry } from "./types.js";
import { useAttachmentDisplay, type UseAttachmentDisplayProps } from "./useAttachmentDisplay.js";
import {
  AttachmentDisplayProvider,
  useAttachmentDisplayContext,
  useAttachmentDisplayItemContext,
  type UseAttachmentDisplayContext,
} from "./useAttachmentDisplayContext.js";
import {
  useAttachmentDisplayTrigger,
  type UseAttachmentDisplayTriggerProps,
} from "./useAttachmentDisplayTrigger.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];
type ImageProps = IntrinsicElements["image"];
type TouchEvent = Parameters<NonNullable<ViewProps["bindtouchstart"]>>[0];

export interface AttachmentDisplayRootProps
  extends UseAttachmentDisplayProps,
    Omit<ViewProps, keyof UseAttachmentDisplayProps> {}

/**
 * 스타일 없이 원격 첨부 상태를 하위 요소에 제공하는 native `<view>`입니다.
 * `data-disabled`·`data-readonly`·`data-invalid`·`data-required`를 붙이며 사용자 props가 우선합니다.
 */
export const AttachmentDisplayRoot = React.forwardRef<NodesRef, AttachmentDisplayRootProps>(
  (props, ref) => {
    const {
      children,
      entries,
      defaultEntries,
      onEntriesChange,
      disabled,
      invalid,
      readOnly,
      required,
      maxEntries,
      ...nativeProps
    } = props;
    const api = useAttachmentDisplay({
      entries,
      defaultEntries,
      onEntriesChange,
      disabled,
      invalid,
      readOnly,
      required,
      maxEntries,
    });

    return (
      <AttachmentDisplayProvider value={api}>
        <view
          {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
          {...api.stateProps}
          {...nativeProps}
        >
          {children}
        </view>
      </AttachmentDisplayProvider>
    );
  },
);
AttachmentDisplayRoot.displayName = "AttachmentDisplayRoot";

export interface AttachmentDisplayTriggerProps
  extends UseAttachmentDisplayTriggerProps,
    Omit<ViewProps, keyof UseAttachmentDisplayTriggerProps> {}

/**
 * 스타일 없이 항목 추가를 요청하는 native `<view>`입니다. picker를 직접 열지 않으므로
 * `bindtap`에서 앱의 media picker를 열고 결과를 `addEntries`에 전달합니다.
 * 눌림 상태가 필요하면 `useAttachmentDisplayTrigger`로 직접 조립합니다.
 */
export const AttachmentDisplayTrigger = React.forwardRef<NodesRef, AttachmentDisplayTriggerProps>(
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
    const { triggerProps } = useAttachmentDisplayTrigger({
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
AttachmentDisplayTrigger.displayName = "AttachmentDisplayTrigger";

export interface AttachmentDisplayItemImageProps extends Omit<ImageProps, "src" | "children"> {}

/**
 * 원격 썸네일을 표시하는 무스타일 native `<image>`입니다. item에 `thumbnailUrl`이 없으면 렌더링하지 않습니다.
 * `accessibility-label`을 주지 않으면 항목 `name`을 사용합니다.
 */
export const AttachmentDisplayItemImage = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemImageProps
>((props, ref) => {
  const { "accessibility-label": accessibilityLabel, ...nativeProps } = props;
  const { imageProps } = useAttachmentDisplayItemContext();
  if (!imageProps) return null;

  return (
    <image
      {...(ref ? { ref: ref as ImageProps["ref"] } : {})}
      src={imageProps.src}
      accessibility-label={accessibilityLabel ?? imageProps.alt}
      {...nativeProps}
    />
  );
});
AttachmentDisplayItemImage.displayName = "AttachmentDisplayItemImage";

export interface AttachmentDisplayItemBackdropProps extends Omit<ViewProps, "children"> {
  /** item 상태가 이 값일 때만 렌더링합니다. */
  status: DisplayItemEntry["status"];
  children?: React.ReactNode | ((entry: DisplayItemEntry) => React.ReactNode);
}

/** item 상태가 `status`와 같을 때만 렌더링하는 무스타일 native `<view>`입니다. */
export const AttachmentDisplayItemBackdrop = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemBackdropProps
>((props, ref) => {
  const { status, children, ...nativeProps } = props;
  const entry = useAttachmentDisplayItemContext();
  if (entry.status !== status) return null;

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {typeof children === "function" ? children(entry) : children}
    </view>
  );
});
AttachmentDisplayItemBackdrop.displayName = "AttachmentDisplayItemBackdrop";

export interface AttachmentDisplayItemRemoveButtonProps extends ViewProps {}

/**
 * 스타일 없이 item을 삭제하는 native `<view>`입니다. 소비자 `bindtap`을 먼저 호출한 뒤 삭제합니다.
 * Root가 `readOnly`이면 tap을 막고 `accessibility-traits`를 따로 주지 않으면 `"disabled"`로 알립니다.
 * `disabled`에서는 삭제합니다.
 */
export const AttachmentDisplayItemRemoveButton = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemRemoveButtonProps
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
  const { removeButtonProps } = useAttachmentDisplayItemContext();
  const { readOnly } = useAttachmentDisplayContext();
  const {
    pressed: _pressed,
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...pressProps
  } = usePressTap({
    disabled: readOnly,
    onTap: (event) => {
      bindtap?.(event);
      removeButtonProps.bindtap();
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
AttachmentDisplayItemRemoveButton.displayName = "AttachmentDisplayItemRemoveButton";

export interface AttachmentDisplayDescriptionProps extends TextProps {}

/**
 * 보조 설명을 표시하는 무스타일 native `<text>`입니다. Root 상태 속성을 붙입니다.
 * Lynx에는 id 기반 설명 연결이 없으므로 Trigger의 `accessibility-label`에 필요한 내용을 포함합니다.
 */
export const AttachmentDisplayDescription = React.forwardRef<
  NodesRef,
  AttachmentDisplayDescriptionProps
>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { stateProps } = useAttachmentDisplayContext();

  return (
    <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...stateProps} {...nativeProps}>
      {children}
    </text>
  );
});
AttachmentDisplayDescription.displayName = "AttachmentDisplayDescription";

export interface AttachmentDisplayErrorMessageProps extends TextProps {}

/** 오류 문구를 표시하는 무스타일 native `<text>`입니다. Root 상태 속성을 붙입니다. */
export const AttachmentDisplayErrorMessage = React.forwardRef<
  NodesRef,
  AttachmentDisplayErrorMessageProps
>((props, ref) => {
  const { children, ...nativeProps } = props;
  const { stateProps } = useAttachmentDisplayContext();

  return (
    <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...stateProps} {...nativeProps}>
      {children}
    </text>
  );
});
AttachmentDisplayErrorMessage.displayName = "AttachmentDisplayErrorMessage";

export interface AttachmentDisplayContextProps {
  children: (context: UseAttachmentDisplayContext) => React.ReactNode;
}

/** Root 상태를 render prop으로 읽습니다. */
export const AttachmentDisplayContext = ({ children }: AttachmentDisplayContextProps) =>
  children(useAttachmentDisplayContext());
