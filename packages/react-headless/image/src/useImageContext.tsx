import { createContext, useContext } from "react";
import type { UseImageReturn } from "./useImage";

export interface UseImageContext extends UseImageReturn {}

const ImageContext = createContext<UseImageContext | null>(null);

export const ImageProvider = ImageContext.Provider;

export function useImageContext({ strict = true }: { strict?: boolean } = {}): UseImageContext {
  const context = useContext(ImageContext);
  if (!context && strict) {
    throw new Error("useImageContext must be used within an Image");
  }

  return context as UseImageContext;
}
