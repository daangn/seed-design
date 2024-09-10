import { create } from "zustand";

interface ProgressCircleState {
  duration: string;
  easing: string;
  value: number;
  minValue: number;
  maxValue: number;
  actions: {
    setDuration: (duration: string) => void;
    setEasing: (easing: string) => void;
    setValue: (value: number) => void;
    setMinValue: (minValue: number) => void;
    setMaxValue: (maxValue: number) => void;
    set: (state: Omit<ProgressCircleState, "actions">) => void;
  };
}

const useProgressCircle = create<ProgressCircleState>((set) => ({
  duration: "0.3s",
  easing: "cubic-bezier(0.35, 0.25, 0.65, 0.75)",
  value: 0,
  minValue: 0,
  maxValue: 100,
  actions: {
    setDuration: (duration) => set({ duration }),
    setEasing: (easing) => set({ easing }),
    setValue: (value) => set({ value }),
    setMinValue: (minValue) => set({ minValue }),
    setMaxValue: (maxValue) => set({ maxValue }),
    set: set,
  },
}));

export const useProgressCircleDuration = () => useProgressCircle((state) => state.duration);
export const useProgressCircleEasing = () => useProgressCircle((state) => state.easing);
export const useProgressCircleValue = () => useProgressCircle((state) => state.value);
export const useProgressCircleMinValue = () => useProgressCircle((state) => state.minValue);
export const useProgressCircleMaxValue = () => useProgressCircle((state) => state.maxValue);
export const useProgressCircleActions = () => useProgressCircle((state) => state.actions);
