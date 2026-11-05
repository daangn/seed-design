declare interface ContextualFloatingButtonVariant {
  /**
  * - `solid`: 배경과 대비되는 강조된 보조 액션으로 중요도 높은 행동 유도 시 적합합니다.
  * - `layer`: 시각적 부담 없이 부드럽게 액션을 유도합니다.
  *
  * @default "solid"
  */
  variant: "solid" | "layer";
/**
  * - `withText`: label과 prefixIcon을 함께 표시합니다.
  * - `iconOnly`: icon만 표시합니다. 아이콘만으로 의미를 전달하기 때문에 접근성 레이블과 함께 사용해야 합니다.
  *
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
}

declare type ContextualFloatingButtonVariantMap = {
  [key in keyof ContextualFloatingButtonVariant]: Array<ContextualFloatingButtonVariant[key]>;
};

export declare type ContextualFloatingButtonVariantProps = Partial<ContextualFloatingButtonVariant>;

export declare const contextualFloatingButtonVariantMap: ContextualFloatingButtonVariantMap;

export declare const contextualFloatingButton: ((
  props?: ContextualFloatingButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ContextualFloatingButtonVariantProps>(
    props: T,
  ) => [ContextualFloatingButtonVariantProps, Omit<T, keyof ContextualFloatingButtonVariantProps>];
}