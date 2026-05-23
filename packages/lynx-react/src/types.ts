import type * as React from "react";
import type { MainThread, TouchEvent } from "@lynx-js/types";

export interface LynxElementProps {
  children?: React.ReactNode;
  className?: string;
}

export interface LynxStyledElementProps extends LynxElementProps {
  style?: React.CSSProperties;
}

export interface LynxPressableProps {
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export interface LynxTouchProps {
  bindtap?: (event: TouchEvent) => void;
  bindtouchstart?: (event: TouchEvent) => void;
  bindtouchend?: (event: TouchEvent) => void;
  bindtouchcancel?: (event: TouchEvent) => void;
  "main-thread:bindtap"?: () => void;
}

export interface LynxIconElementProps {
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<MainThread.Element>;
  "main-thread:binduiappear"?: () => void;
}
