declare interface AspectRatioVariant {
  
  disabled?: true;
  loading?: true;}

declare type AspectRatioVariantMap = {
  [key in keyof AspectRatioVariant]: Array<AspectRatioVariant[key]>;
};

export declare type AspectRatioVariantProps = Partial<AspectRatioVariant>;

export declare type AspectRatioSlotName = "root" | "text";

export declare const aspectRatioVariantMap: AspectRatioVariantMap;

export declare const aspectRatio: ((
  props?: AspectRatioVariantProps,
) => Record<AspectRatioSlotName, string>) & {
  splitVariantProps: <T extends AspectRatioVariantProps>(
    props: T,
  ) => [AspectRatioVariantProps, Omit<T, keyof AspectRatioVariantProps>];
}