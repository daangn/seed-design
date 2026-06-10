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

/**
 * @platform Lynx
 *
 * native element(`<view>`/`<text>`/`<image>` 등)가 공유하는 접근성 속성 모음.
 * `@lynx-js/types`의 StandardProps 접근성 속성을 표준화한 타입으로, 컴포넌트가
 * 확장해 native element에 패스스루한다. 모든 native tag가 동일한 공통 속성을
 * 가지며 tag별 차이는 없다.
 *
 * web ARIA 대응:
 * - `accessibility-label` ← `aria-label`
 * - `accessibility-role-description` ← `role` (switch/checkbox/progressbar)
 * - `accessibility-value` ← `aria-checked` / `aria-valuenow`
 * - `accessibility-elements-hidden` ← `aria-hidden`
 *
 * `accessibility-traits`는 단일 값이라 `selected`+`disabled` 동시 표현이 안 된다.
 * 역할은 `accessibility-role-description`, 상태는 `accessibility-value`로 분담한다.
 */
export type LynxAccessibilityProps = Pick<
  LynxViewProps,
  | "accessibility-label"
  | "accessibility-traits"
  | "accessibility-element"
  | "accessibility-value"
  | "accessibility-role-description"
  | "accessibility-elements-hidden"
  | "accessibility-heading"
  | "accessibility-actions"
  | "accessibility-exclusive-focus"
  | "ios-platform-accessibility-id"
>;
