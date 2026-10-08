declare interface FieldButtonVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  readOnly: boolean;
}

declare type FieldButtonVariantMap = {
  [key in keyof FieldButtonVariant]: Array<FieldButtonVariant[key]>;
};

export declare type FieldButtonVariantProps = Partial<FieldButtonVariant>;

export declare type FieldButtonSlotName = "root" | "button" | "content" | "baseStroke" | "stroke" | "value" | "placeholder" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon" | "clearButton";

export declare const fieldButtonVariantMap: FieldButtonVariantMap;

export declare const fieldButton: ((
  props?: FieldButtonVariantProps,
) => Record<FieldButtonSlotName, string>) & {
  splitVariantProps: <T extends FieldButtonVariantProps>(
    props: T,
  ) => [FieldButtonVariantProps, Omit<T, keyof FieldButtonVariantProps>];
}