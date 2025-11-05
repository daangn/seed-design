export type ScrollPlacement = "top" | "bottom" | "left" | "right";

export interface SizesConfig {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface VisibilityState {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export interface ScrollState {
  canScrollTop: boolean;
  canScrollBottom: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}
