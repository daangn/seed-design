declare interface FieldLabelVariant {
  /**
  * @default "medium"
  */
  weight: "medium" | "bold";
}

declare type FieldLabelVariantMap = {
  [key in keyof FieldLabelVariant]: Array<FieldLabelVariant[key]>;
};

export declare type FieldLabelVariantProps = Partial<FieldLabelVariant>;

export declare const fieldLabelVariantMap: FieldLabelVariantMap;

export declare const fieldLabel: ((
  props?: FieldLabelVariantProps,
) => string) & {
  splitVariantProps: <T extends FieldLabelVariantProps>(
    props: T,
  ) => [FieldLabelVariantProps, Omit<T, keyof FieldLabelVariantProps>];
}