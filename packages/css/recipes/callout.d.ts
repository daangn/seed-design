declare interface CalloutVariant {
  /**
  * - `neutral`: 일반적인 정보를 전달합니다.
  * - `informative`: 유용한 정보를 제공합니다.
  * - `positive`: 긍정적인 상태를 나타냅니다.
  * - `warning`: 주의가 필요한 상태를 나타냅니다.
  * - `critical`: 중요한 문제를 나타냅니다.
  * - `magic`: AI 기능을 나타냅니다.
  *
  * @default "neutral"
  */
  tone: "neutral" | "informative" | "positive" | "warning" | "critical" | "magic";
}

declare type CalloutVariantMap = {
  [key in keyof CalloutVariant]: Array<CalloutVariant[key]>;
};

export declare type CalloutVariantProps = Partial<CalloutVariant>;

export declare type CalloutSlotName = "root" | "content" | "title" | "description" | "link" | "closeButton";

export declare const calloutVariantMap: CalloutVariantMap;

export declare const callout: ((
  props?: CalloutVariantProps,
) => Record<CalloutSlotName, string>) & {
  splitVariantProps: <T extends CalloutVariantProps>(
    props: T,
  ) => [CalloutVariantProps, Omit<T, keyof CalloutVariantProps>];
}