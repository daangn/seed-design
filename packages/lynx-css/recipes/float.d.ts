declare interface FloatVariant {
  placement: "top-start" | "top-center" | "top-end" | "middle-start" | "middle-center" | "middle-end" | "bottom-start" | "bottom-center" | "bottom-end";
}

declare type FloatVariantMap = {
  [key in keyof FloatVariant]: Array<FloatVariant[key]>;
};

export declare type FloatVariantProps = Partial<FloatVariant>;

export declare const floatVariantMap: FloatVariantMap;

export declare const float: ((
  props?: FloatVariantProps,
) => string) & {
  splitVariantProps: <T extends FloatVariantProps>(
    props: T,
  ) => [FloatVariantProps, Omit<T, keyof FloatVariantProps>];
}