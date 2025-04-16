declare interface FormControlVariant {
  /**
  * @default large
  */
  size: "large" | "medium";
}

declare type FormControlVariantMap = {
  [key in keyof FormControlVariant]: Array<FormControlVariant[key]>;
};

export declare type FormControlVariantProps = Partial<FormControlVariant>;

export declare type FormControlSlotName = "root" | "header" | "label" | "indicator" | "footer" | "description" | "errorMessage" | "errorIcon" | "characterCountArea" | "characterCount" | "maxCharacterCount";

export declare const formControlVariantMap: FormControlVariantMap;

export declare const formControl: ((
  props?: FormControlVariantProps,
) => Record<FormControlSlotName, string>) & {
  splitVariantProps: <T extends FormControlVariantProps>(
    props: T,
  ) => [FormControlVariantProps, Omit<T, keyof FormControlVariantProps>];
}