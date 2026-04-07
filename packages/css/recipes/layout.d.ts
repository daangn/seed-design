declare interface LayoutVariant {
  /**
  * @default "medium"
  */
  density: "low" | "medium" | "high";
}

declare type LayoutVariantMap = {
  [key in keyof LayoutVariant]: Array<LayoutVariant[key]>;
};

export declare type LayoutVariantProps = Partial<LayoutVariant>;

export declare type LayoutSlotName = "root" | "content";

export declare const layoutVariantMap: LayoutVariantMap;

export declare const layout: ((
  props?: LayoutVariantProps,
) => Record<LayoutSlotName, string>) & {
  splitVariantProps: <T extends LayoutVariantProps>(
    props: T,
  ) => [LayoutVariantProps, Omit<T, keyof LayoutVariantProps>];
}