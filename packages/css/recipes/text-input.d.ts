declare interface TextInputVariant {
  /**
  * - `outline`: 기본 스타일입니다.
  * - `underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
  *
  * @default "outline"
  */
  variant: "outline" | "underline";
/**
  * @default "large"
  */
  size: "large" | "medium";
}

declare type TextInputVariantMap = {
  [key in keyof TextInputVariant]: Array<TextInputVariant[key]>;
};

export declare type TextInputVariantProps = Partial<TextInputVariant>;

export declare type TextInputSlotName = "root" | "value" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon";

export declare const textInputVariantMap: TextInputVariantMap;

export declare const textInput: ((
  props?: TextInputVariantProps,
) => Record<TextInputSlotName, string>) & {
  splitVariantProps: <T extends TextInputVariantProps>(
    props: T,
  ) => [TextInputVariantProps, Omit<T, keyof TextInputVariantProps>];
}