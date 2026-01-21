import { createContext, useContext } from "react";
import type { UseSliderReturn } from "./useSlider";

export interface UseSliderContext extends UseSliderReturn {}

const SliderContext = createContext<UseSliderContext | null>(null);

export const SliderProvider = SliderContext.Provider;

export function useSliderContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSliderContext | null : UseSliderContext {
  const context = useContext(SliderContext);
  if (!context && strict) {
    throw new Error("useSliderContext must be used within a Slider");
  }

  return context as UseSliderContext;
}
