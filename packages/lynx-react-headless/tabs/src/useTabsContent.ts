import * as React from "@lynx-js/react";
import { useTabsContext } from "./useTabsContext.js";
import { useTabsCarouselCameraContext } from "./TabsCarouselCameraContext.js";
export interface UseTabsContentProps {
  value: string;
}
export function useTabsContent({ value: contentValue }: UseTabsContentProps) {
  const tabsContext = useTabsContext();
  const inCarousel = useTabsCarouselCameraContext();
  const selected = tabsContext.value === contentValue;
  const disabled = tabsContext.items.find((item) => item.value === contentValue)?.disabled ?? false;
  React.useEffect(() => {
    "background only";
    if (inCarousel) return tabsContext.registerContent(contentValue);
  }, [inCarousel, tabsContext.registerContent, contentValue]);

  return React.useMemo(
    () => ({
      isSelected: selected,
      isDisabled: disabled,
      inCarousel,
      contentProps: {
        "accessibility-elements-hidden": !selected,
        "accessibility-role-description": "tabpanel",
        "accessibility-value": selected ? "selected" : "not selected",
      },
    }),
    [selected, disabled, inCarousel],
  );
}
export type UseTabsContentReturn = ReturnType<typeof useTabsContent>;
