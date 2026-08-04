declare interface TextInputVariant {
  /**
  * @default "outline"
  */
  variant: "outline" | "underline";
/**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  focused: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  readOnly: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type TextInputVariantMap = {
  [key in keyof TextInputVariant]: Array<TextInputVariant[key]>;
};

export declare type TextInputVariantProps = Partial<TextInputVariant>;

export declare type TextInputSlotName = "root" | "stroke" | "value" | "textareaRoot" | "textareaValue" | "textareaControl" | "textareaMirror" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon";

export declare const textInputVariantMap: TextInputVariantMap;

export declare const textInput: ((
  props?: TextInputVariantProps,
) => Record<TextInputSlotName, string>) & {
  splitVariantProps: <T extends TextInputVariantProps>(
    props: T,
  ) => [TextInputVariantProps, Omit<T, keyof TextInputVariantProps>];
}