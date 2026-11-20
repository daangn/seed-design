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

export declare type HelpBubbleSlotName = "positioner" | "motion" | "content" | "arrow" | "arrowTip" | "body" | "title" | "description" | "closeButton" | "closeButtonContent";

export declare const helpBubbleVariantMap: HelpBubbleVariantMap;

export declare const helpBubble: ((
  props?: HelpBubbleVariantProps,
) => Record<HelpBubbleSlotName, string>) & {
  splitVariantProps: <T extends HelpBubbleVariantProps>(
    props: T,
  ) => [HelpBubbleVariantProps, Omit<T, keyof HelpBubbleVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const helpBubbleSeedTagSpec: {
  readonly name: "HelpBubble";
  readonly axes: readonly [];
  readonly defaults: {};
};
