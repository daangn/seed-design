declare interface AttachmentInputVariant {
  /**
  * @default false
  */
  extendSafeAreaX: boolean;
}

declare type AttachmentInputVariantMap = {
  [key in keyof AttachmentInputVariant]: Array<AttachmentInputVariant[key]>;
};

export declare type AttachmentInputVariantProps = Partial<AttachmentInputVariant>;

export declare type AttachmentInputSlotName = "root" | "container" | "containerContent" | "itemGroup";

export declare const attachmentInputVariantMap: AttachmentInputVariantMap;

export declare const attachmentInput: ((
  props?: AttachmentInputVariantProps,
) => Record<AttachmentInputSlotName, string>) & {
  splitVariantProps: <T extends AttachmentInputVariantProps>(
    props: T,
  ) => [AttachmentInputVariantProps, Omit<T, keyof AttachmentInputVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const attachmentInputSeedTagSpec: {
  readonly name: "AttachmentInput";
  readonly axes: readonly [];
  readonly defaults: {};
};
