declare interface FieldVariant {
  /**
  * @default large
  */
  size: "large" | "medium";
}

declare type FieldVariantMap = {
  [key in keyof FieldVariant]: Array<FieldVariant[key]>;
};

export declare type FieldVariantProps = Partial<FieldVariant>;

export declare type FieldSlotName = "root" | "header" | "label" | "indicator" | "footer" | "description" | "errorMessage" | "errorIcon" | "characterCountArea" | "characterCount" | "maxCharacterCount";

export declare const fieldVariantMap: FieldVariantMap;

export declare const field: ((
  props?: FieldVariantProps,
) => Record<FieldSlotName, string>) & {
  splitVariantProps: <T extends FieldVariantProps>(
    props: T,
  ) => [FieldVariantProps, Omit<T, keyof FieldVariantProps>];
}