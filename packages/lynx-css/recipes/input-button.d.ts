declare interface InputButtonVariant {
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

declare type InputButtonVariantMap = {
  [key in keyof InputButtonVariant]: Array<InputButtonVariant[key]>;
};

export declare type InputButtonVariantProps = Partial<InputButtonVariant>;

export declare type InputButtonSlotName = "root" | "button" | "baseStroke" | "stroke" | "value" | "placeholder" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon" | "clearButton";

export declare const inputButtonVariantMap: InputButtonVariantMap;

export declare const inputButton: ((
  props?: InputButtonVariantProps,
) => Record<InputButtonSlotName, string>) & {
  splitVariantProps: <T extends InputButtonVariantProps>(
    props: T,
  ) => [InputButtonVariantProps, Omit<T, keyof InputButtonVariantProps>];
}