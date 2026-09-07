declare interface SelectTriggerVariant {
  /**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  open: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  readOnly: boolean;
}

declare type SelectTriggerVariantMap = {
  [key in keyof SelectTriggerVariant]: Array<SelectTriggerVariant[key]>;
};

export declare type SelectTriggerVariantProps = Partial<SelectTriggerVariant>;

export declare type SelectTriggerSlotName = "root" | "value" | "placeholder" | "prefixIcon" | "suffixIcon";

export declare const selectTriggerVariantMap: SelectTriggerVariantMap;

export declare const selectTrigger: ((
  props?: SelectTriggerVariantProps,
) => Record<SelectTriggerSlotName, string>) & {
  splitVariantProps: <T extends SelectTriggerVariantProps>(
    props: T,
  ) => [SelectTriggerVariantProps, Omit<T, keyof SelectTriggerVariantProps>];
}