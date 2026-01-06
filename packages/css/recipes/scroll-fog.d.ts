declare interface ScrollFogVariant {
  /**
  * @default false
  */
  hideScrollBar: boolean;
}

declare type ScrollFogVariantMap = {
  [key in keyof ScrollFogVariant]: Array<ScrollFogVariant[key]>;
};

export declare type ScrollFogVariantProps = Partial<ScrollFogVariant>;

export declare const scrollFogVariantMap: ScrollFogVariantMap;

export declare const scrollFog: ((
  props?: ScrollFogVariantProps,
) => string) & {
  splitVariantProps: <T extends ScrollFogVariantProps>(
    props: T,
  ) => [ScrollFogVariantProps, Omit<T, keyof ScrollFogVariantProps>];
}