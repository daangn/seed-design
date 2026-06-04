import type { ReactNode, Ref } from "@lynx-js/react";
import type {
  CSSProperties,
  IntrinsicElements,
  MainThread,
  NodesRef,
  TextProps,
  ViewProps,
} from "@lynx-js/types";

export type LynxViewProps = IntrinsicElements["view"] & ViewProps;
export type LynxTextProps = IntrinsicElements["text"] & TextProps;
export type LynxViewRef = Ref<NodesRef>;
export type LynxTextRef = Ref<NodesRef>;
export type LynxMainThreadRef = Ref<MainThread.Element>;
export type LynxStyle = CSSProperties;

export interface LynxElementProps {
  children?: ReactNode;
  className?: LynxViewProps["className"];
}

export interface LynxStyledElementProps extends LynxElementProps {
  style?: LynxStyle;
}

export interface LynxPressableProps {
  bindtap?: LynxViewProps["bindtap"];
  "main-thread:bindtap"?: LynxViewProps["main-thread:bindtap"];
}

export interface LynxTouchProps {
  bindtap?: LynxViewProps["bindtap"];
  bindtouchstart?: LynxViewProps["bindtouchstart"];
  bindtouchend?: LynxViewProps["bindtouchend"];
  bindtouchcancel?: LynxViewProps["bindtouchcancel"];
  "main-thread:bindtap"?: LynxViewProps["main-thread:bindtap"];
}

export interface LynxIconElementProps {
  className?: IntrinsicElements["image"]["className"];
  style?: LynxStyle;
  ref?: LynxMainThreadRef;
  "main-thread:binduiappear"?: IntrinsicElements["image"]["main-thread:binduiappear"];
}
