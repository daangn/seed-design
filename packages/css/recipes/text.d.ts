declare interface TextVariant {
  /**
  * @default "t5Regular"
  */
  textStyle: "screenTitle" | "articleBody" | "t1Regular" | "t1Medium" | "t1Bold" | "t2Regular" | "t2Medium" | "t2Bold" | "t3Regular" | "t3Medium" | "t3Bold" | "t4Regular" | "t4Medium" | "t4Bold" | "t5Regular" | "t5Medium" | "t5Bold" | "t6Regular" | "t6Medium" | "t6Bold" | "t7Regular" | "t7Medium" | "t7Bold" | "t8Bold" | "t9Bold" | "t10Bold" | "t1RegularStatic" | "t1MediumStatic" | "t1BoldStatic" | "t2RegularStatic" | "t2MediumStatic" | "t2BoldStatic" | "t3RegularStatic" | "t3MediumStatic" | "t3BoldStatic" | "t4RegularStatic" | "t4MediumStatic" | "t4BoldStatic" | "t5RegularStatic" | "t5MediumStatic" | "t5BoldStatic" | "t6RegularStatic" | "t6MediumStatic" | "t6BoldStatic" | "t7RegularStatic" | "t7MediumStatic" | "t7BoldStatic" | "t8BoldStatic" | "t9BoldStatic" | "t10BoldStatic";
/**
  * @default "none"
  */
  maxLines: "none" | "single" | "multi";
/**
  * @default "none"
  */
  textDecorationLine: "none" | "line-through" | "underline";
}

declare type TextVariantMap = {
  [key in keyof TextVariant]: Array<TextVariant[key]>;
};

export declare type TextVariantProps = Partial<TextVariant>;

export declare const textVariantMap: TextVariantMap;

export declare const text: ((
  props?: TextVariantProps,
) => string) & {
  splitVariantProps: <T extends TextVariantProps>(
    props: T,
  ) => [TextVariantProps, Omit<T, keyof TextVariantProps>];
}