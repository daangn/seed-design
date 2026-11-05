import type * as React from "react";

const isTouchSupported = typeof window !== "undefined" && "ontouchstart" in window;

export const touchStart = isTouchSupported ? "onTouchStart" : "onPointerDown";

export const touchMove = isTouchSupported ? "onTouchMove" : "onPointerMove";

export const touchEnd = isTouchSupported ? "onTouchEnd" : "onPointerUp";

export const touchCancel = isTouchSupported ? "onTouchCancel" : "onPointerCancel";

function isTouchEvent(e: React.TouchEvent | React.PointerEvent): e is React.TouchEvent {
  return e.type === "touchstart" || e.type === "touchmove" || e.type === "touchend";
}

export function isLeftPress(e: React.TouchEvent | React.PointerEvent) {
  return isTouchEvent(e) ? e.touches.length === 1 : e.buttons === 1;
}

export function getClientY(e: React.TouchEvent | React.PointerEvent) {
  return isTouchEvent(e) ? e.touches[0].clientY : e.clientY;
}
