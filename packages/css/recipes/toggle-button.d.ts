declare interface ToggleButtonVariant {
  /**
  * - `brandSolid`: 브랜드 컬러로 강조된 스타일입니다.
  * - `neutralWeak`: 기본적인 토글 스타일입니다.
  *
  * @default "brandSolid"
  */
  variant: "brandSolid" | "neutralWeak";
/**
  * @default "small"
  */
  size: "xsmall" | "small";
}

declare type ToggleButtonVariantMap = {
  [key in keyof ToggleButtonVariant]: Array<ToggleButtonVariant[key]>;
};

export declare type ToggleButtonVariantProps = Partial<ToggleButtonVariant>;

export declare const toggleButtonVariantMap: ToggleButtonVariantMap;

export declare const toggleButton: ((
  props?: ToggleButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ToggleButtonVariantProps>(
    props: T,
  ) => [ToggleButtonVariantProps, Omit<T, keyof ToggleButtonVariantProps>];
}