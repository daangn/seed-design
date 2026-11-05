declare interface ActionButtonVariant {
  /**
  * - `brandSolid`: 브랜드의 핵심 가치를 전달하며, 사용자 간 연결이 일어나는 서비스의 주요 기능에 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다.
  * - `neutralSolid`: 대부분의 화면에서 CTA로 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다.
  * - `neutralWeak`: CTA를 제외한 대부분의 액션에 사용됩니다.
  * - `criticalSolid`: 삭제나 초기화처럼 되돌릴 수 없는 중요한 작업에 사용합니다.
  * - `brandOutline`: variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=neutralOutline과 조합하여 사용하는 것을 권장합니다.
  * - `neutralOutline`: variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=brandOutline과 조합하여 사용하는 것을 권장합니다.
  * - `ghost`: 배경 없이 텍스트와 아이콘만 표시됩니다. 모두 동일한 색상을 사용하는 조건에서 icon, prefix icon, suffix icon, label에 정의된 color를 변경할 수 있으며, label의 fontWeight를 `$font-weight.regular` 또는 `$font-weight.medium`으로 변경하여 주목도를 조절할 수 있습니다.
  *
  * @default "brandSolid"
  */
  variant: "brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid" | "brandOutline" | "neutralOutline" | "ghost";
/**
  * - `xsmall`: 작은 공간에서 효율적으로 사용할 수 있는 Pill 형태로 제공됩니다.
  * - `small`: 화면 중앙에서 범용적으로 사용됩니다.
  * - `medium`: 화면 중앙에서 범용적으로 사용됩니다.
  * - `large`: 주로 CTA 역할로 사용됩니다.
  *
  * @default "medium"
  */
  size: "xsmall" | "small" | "medium" | "large";
/**
  * - `withText`: 텍스트와 함께 아이콘을 표시할 수 있습니다.
  * - `iconOnly`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
  *
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
}

declare type ActionButtonVariantMap = {
  [key in keyof ActionButtonVariant]: Array<ActionButtonVariant[key]>;
};

export declare type ActionButtonVariantProps = Partial<ActionButtonVariant>;

export declare const actionButtonVariantMap: ActionButtonVariantMap;

export declare const actionButton: ((
  props?: ActionButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ActionButtonVariantProps>(
    props: T,
  ) => [ActionButtonVariantProps, Omit<T, keyof ActionButtonVariantProps>];
}