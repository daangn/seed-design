import { createContext, useContext } from "react";
import type { UseRenderStrategyProps } from "./useRenderStrategy";

export interface UseRenderStrategyPropsContext extends UseRenderStrategyProps {}

const RenderStrategyPropsContext = createContext<UseRenderStrategyPropsContext | null>(null);

export const RenderStrategyPropsProvider = RenderStrategyPropsContext.Provider;

export function useRenderStrategyPropsContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseRenderStrategyPropsContext | null : UseRenderStrategyPropsContext {
  const context = useContext(RenderStrategyPropsContext);
  if (!context && strict) {
    throw new Error(
      "useRenderStrategyPropsContext must be used within a RenderStrategyPropsProvider",
    );
  }

  return context as UseRenderStrategyPropsContext;
}
