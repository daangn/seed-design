import { createContext, useContext, type Provider } from "@lynx-js/react";
const TabsCarouselCameraContext = createContext(false);
export const TabsCarouselCameraProvider: Provider<boolean> = TabsCarouselCameraContext.Provider;
export function useTabsCarouselCameraContext() {
  return useContext(TabsCarouselCameraContext);
}
