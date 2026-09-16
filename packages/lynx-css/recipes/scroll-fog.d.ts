declare interface ScrollFogVariant {
  /**
  * @default false
  */
  top: boolean;
/**
  * @default false
  */
  bottom: boolean;
/**
  * @default false
  */
  left: boolean;
/**
  * @default false
  */
  right: boolean;
}

declare type ScrollFogVariantMap = {
  [key in keyof ScrollFogVariant]: Array<ScrollFogVariant[key]>;
};

export declare type ScrollFogVariantProps = Partial<ScrollFogVariant>;

export declare type ScrollFogSlotName = "root" | "topMask" | "bottomMask" | "leftMask" | "rightMask" | "verticalScroll" | "horizontalScroll";

export declare const scrollFogVariantMap: ScrollFogVariantMap;

export declare const scrollFog: ((
  props?: ScrollFogVariantProps,
) => Record<ScrollFogSlotName, string>) & {
  splitVariantProps: <T extends ScrollFogVariantProps>(
    props: T,
  ) => [ScrollFogVariantProps, Omit<T, keyof ScrollFogVariantProps>];
}