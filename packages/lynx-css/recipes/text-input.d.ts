declare interface TextInputVariant {
  /**
  * @default "outline"
  */
  variant: "outline" | "underline";
/**
  * @default "large"
  */
  size: "large" | "medium";
/**
  * @default false
  */
  focused: boolean;
/**
  * @default false
  */
  invalid: boolean;
/**
  * @default false
  */
  readOnly: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type TextInputVariantMap = {
  [key in keyof TextInputVariant]: Array<TextInputVariant[key]>;
};

export declare type TextInputVariantProps = Partial<TextInputVariant>;

export declare type TextInputSlotName = "root" | "baseStroke" | "stroke" | "value" | "textareaRoot" | "textareaAutoresizeRoot" | "textareaValue" | "textareaFixed" | "textareaNativeAutoresize" | "textareaAndroidAutoresize" | "prefixText" | "prefixIcon" | "suffixText" | "suffixIcon";

export declare const textInputVariantMap: TextInputVariantMap;

export declare const textInput: ((
  props?: TextInputVariantProps,
) => Record<TextInputSlotName, string>) & {
  splitVariantProps: <T extends TextInputVariantProps>(
    props: T,
  ) => [TextInputVariantProps, Omit<T, keyof TextInputVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const textInputSeedTagSpec: {
  readonly name: "TextInput";
  readonly axes: readonly ["variant", "size", "type"];
  readonly defaults: { readonly variant: "outline"; readonly size: "large" };
};
