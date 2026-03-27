declare interface InputButtonVariant {
  
}

declare type InputButtonVariantMap = {
  [key in keyof InputButtonVariant]: Array<InputButtonVariant[key]>;
};

export declare type InputButtonVariantProps = Partial<InputButtonVariant>;

export declare type InputButtonSlotName = "root" | "value" | "placeholder" | "button" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon" | "clearButton";

export declare const inputButtonVariantMap: InputButtonVariantMap;

export declare const inputButton: ((
  props?: InputButtonVariantProps,
) => Record<InputButtonSlotName, string>) & {
  splitVariantProps: <T extends InputButtonVariantProps>(
    props: T,
  ) => [InputButtonVariantProps, Omit<T, keyof InputButtonVariantProps>];
}