declare interface ScrollFogVariant {
  /**
  * @default false
  */
  hideScrollBar: boolean;
  disabled?: true;
  loading?: true;}

declare type ScrollFogVariantMap = {
  [key in keyof ScrollFogVariant]: Array<ScrollFogVariant[key]>;
};

export declare type ScrollFogVariantProps = Partial<ScrollFogVariant>;

export declare type ScrollFogSlotName = "root" | "text";

export declare const scrollFogVariantMap: ScrollFogVariantMap;

export declare const scrollFog: ((
  props?: ScrollFogVariantProps,
) => Record<ScrollFogSlotName, string>) & {
  splitVariantProps: <T extends ScrollFogVariantProps>(
    props: T,
  ) => [ScrollFogVariantProps, Omit<T, keyof ScrollFogVariantProps>];
}