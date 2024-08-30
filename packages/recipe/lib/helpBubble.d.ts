interface HelpBubbleVariant {
  variant: "nonModal" | "modal"
}

type HelpBubbleVariantMap = {
  [key in keyof HelpBubbleVariant]: Array<HelpBubbleVariant[key]>;
};

export type HelpBubbleVariantProps = Partial<HelpBubbleVariant>;

export type HelpBubbleSlotName = "positioner" | "backdrop" | "content" | "arrow" | "title" | "description";

export const helpBubbleVariantMap: HelpBubbleVariantMap;

export function helpBubble(
  props?: HelpBubbleVariantProps,
): Record<HelpBubbleSlotName, string>;