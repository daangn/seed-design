"use client";

import * as React from "react";

export interface WheelPickerContextValue {
  itemSize: number;
  visibleItemCount: number;
  disabled: boolean;
  readOnly: boolean;
}

const WheelPickerContext = React.createContext<WheelPickerContextValue | null>(null);

export const WheelPickerProvider = WheelPickerContext.Provider;

export function useWheelPickerContext() {
  const context = React.useContext(WheelPickerContext);

  if (!context) {
    throw new Error("WheelPicker.Column은 WheelPicker.Root 내부에서 사용해야 합니다.");
  }

  return context;
}
