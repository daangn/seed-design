declare interface FieldButtonVariant {
  
}

declare type FieldButtonVariantMap = {
  [key in keyof FieldButtonVariant]: Array<FieldButtonVariant[key]>;
};

export declare type FieldButtonVariantProps = Partial<FieldButtonVariant>;

export declare type FieldButtonSlotName = "positioner" | "root" | "value" | "placeholder" | "button" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon";

export declare const fieldButtonVariantMap: FieldButtonVariantMap;

export declare const fieldButton: ((
  props?: FieldButtonVariantProps,
) => Record<FieldButtonSlotName, string>) & {
  splitVariantProps: <T extends FieldButtonVariantProps>(
    props: T,
  ) => [FieldButtonVariantProps, Omit<T, keyof FieldButtonVariantProps>];
}