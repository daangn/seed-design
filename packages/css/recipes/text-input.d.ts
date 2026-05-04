declare interface TextInputVariant {
  /**
  * - `outline`: 기본 스타일입니다.
  * - `underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
  *
  * @default "outline"
  */
  variant: "outline" | "underline";
/**
  * - `large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
  * - `medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
  *
  * @default "large"
  */
  size: "large" | "medium" | "responsive";
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