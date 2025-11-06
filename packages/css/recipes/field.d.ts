declare interface FieldVariant {
  
}

declare type FieldVariantMap = {
  [key in keyof FieldVariant]: Array<FieldVariant[key]>;
};

export declare type FieldVariantProps = Partial<FieldVariant>;

export declare type FieldSlotName = "root" | "header" | "footer" | "description" | "errorMessage" | "characterCountArea" | "characterCount" | "maxCharacterCount";

export declare const fieldVariantMap: FieldVariantMap;

export declare const field: ((
  props?: FieldVariantProps,
) => Record<FieldSlotName, string>) & {
  splitVariantProps: <T extends FieldVariantProps>(
    props: T,
  ) => [FieldVariantProps, Omit<T, keyof FieldVariantProps>];
}