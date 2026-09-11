declare interface HelpBubbleVariant {
  /**
  * @default false
  */
  open: boolean;
/**
  * @default false
  */
  positioned: boolean;
/**
  * @default "top"
  */
  side: "top" | "right" | "bottom" | "left";
/**
  * @default false
  */
  pressed: boolean;
}

declare type HelpBubbleVariantMap = {
  [key in keyof HelpBubbleVariant]: Array<HelpBubbleVariant[key]>;
};

export declare type HelpBubbleVariantProps = Partial<HelpBubbleVariant>;

export declare type HelpBubbleSlotName = "positioner" | "content" | "arrow" | "arrowTip" | "body" | "title" | "description" | "closeButton";

export declare const helpBubbleVariantMap: HelpBubbleVariantMap;

export declare const helpBubble: ((
  props?: HelpBubbleVariantProps,
) => Record<HelpBubbleSlotName, string>) & {
  splitVariantProps: <T extends HelpBubbleVariantProps>(
    props: T,
  ) => [HelpBubbleVariantProps, Omit<T, keyof HelpBubbleVariantProps>];
}