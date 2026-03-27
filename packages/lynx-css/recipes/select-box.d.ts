declare interface SelectBoxVariant {
  /**
  * @default "horizontal"
  */
  layout: "horizontal" | "vertical";
}

declare type SelectBoxVariantMap = {
  [key in keyof SelectBoxVariant]: Array<SelectBoxVariant[key]>;
};

export declare type SelectBoxVariantProps = Partial<SelectBoxVariant>;

export declare type SelectBoxSlotName = "root" | "trigger" | "content" | "body" | "label" | "description" | "footer";

export declare const selectBoxVariantMap: SelectBoxVariantMap;

export declare const selectBox: ((
  props?: SelectBoxVariantProps,
) => Record<SelectBoxSlotName, string>) & {
  splitVariantProps: <T extends SelectBoxVariantProps>(
    props: T,
  ) => [SelectBoxVariantProps, Omit<T, keyof SelectBoxVariantProps>];
}