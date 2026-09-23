import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useAccordionItemContext } from "./useAccordionContext.js";

type ViewProps = IntrinsicElements["view"];
type LayoutChangeHandler = NonNullable<ViewProps["bindlayoutchange"]>;

export interface UseAccordionContentProps {
  style?: ViewProps["style"];
  "accessibility-elements-hidden"?: ViewProps["accessibility-elements-hidden"];
}

export interface UseAccordionContentReturn {
  open: boolean;
  contentProps: {
    style: ViewProps["style"];
    "accessibility-elements-hidden": ViewProps["accessibility-elements-hidden"];
  };
  contentInnerProps: { bindlayoutchange: LayoutChangeHandler };
}

function getContentLayoutHeight(event: Parameters<LayoutChangeHandler>[0]): number | null {
  const eventWithHeight = event as Parameters<LayoutChangeHandler>[0] & { height?: number };
  const height = event.detail?.height ?? event.params?.height ?? eventWithHeight.height;
  if (typeof height !== "number" || !Number.isFinite(height)) return null;
  return Math.max(0, height);
}

export function useAccordionContent({
  style,
  "accessibility-elements-hidden": accessibilityElementsHidden = false,
}: UseAccordionContentProps = {}): UseAccordionContentReturn {
  const context = useAccordionItemContext("AccordionContent");
  const [contentHeight, setContentHeight] = React.useState(0);
  const handleContentLayoutChange = React.useCallback<LayoutChangeHandler>((event) => {
    const height = getContentLayoutHeight(event);
    if (height !== null) setContentHeight((current) => (current === height ? current : height));
  }, []);

  return {
    open: context.open,
    contentProps: {
      style:
        typeof style === "string"
          ? `${style};height:${context.open ? `${contentHeight}px` : "0px"}`
          : { ...style, height: context.open ? `${contentHeight}px` : "0px" },
      "accessibility-elements-hidden": !context.open || accessibilityElementsHidden,
    },
    contentInnerProps: { bindlayoutchange: handleContentLayoutChange },
  };
}
