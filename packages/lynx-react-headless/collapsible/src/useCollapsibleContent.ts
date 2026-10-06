import type { IntrinsicElements } from "@lynx-js/types";
import type { UseCollapsibleReturn } from "./useCollapsible.js";
import { useCollapsibleContext } from "./useCollapsibleContext.js";

type ViewProps = IntrinsicElements["view"];

export interface UseCollapsibleContentProps {
  style?: ViewProps["style"];
  "accessibility-elements-hidden"?: ViewProps["accessibility-elements-hidden"];
}

export interface UseCollapsibleContentReturn {
  open: boolean;
  /** 소비자 `style`·`accessibility-elements-hidden`과 합친 바깥 view props입니다. */
  contentProps: {
    style: ViewProps["style"];
    "accessibility-elements-hidden": ViewProps["accessibility-elements-hidden"];
  };
  contentInnerProps: UseCollapsibleReturn["contentInnerProps"];
}

/**
 * 가까운 Collapsible의 접힘 높이·접근성 숨김을 소비자 props와 합쳐 반환합니다.
 */
export function useCollapsibleContent({
  style,
  "accessibility-elements-hidden": accessibilityElementsHidden = false,
}: UseCollapsibleContentProps = {}): UseCollapsibleContentReturn {
  const { open, contentProps, contentInnerProps } = useCollapsibleContext();
  const { height, overflow } = contentProps.style;

  return {
    open,
    contentProps: {
      style:
        typeof style === "string"
          ? `${style};height:${height};overflow:${overflow}`
          : { ...style, height, overflow },
      "accessibility-elements-hidden":
        contentProps["accessibility-elements-hidden"] || accessibilityElementsHidden,
    },
    contentInnerProps,
  };
}
