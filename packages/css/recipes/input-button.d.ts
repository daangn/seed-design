declare interface InputButtonVariant {
  /**
  * - `large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
  * - `medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
  *
  * @default "large"
  */
  size: "large" | "medium" | "responsive";
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