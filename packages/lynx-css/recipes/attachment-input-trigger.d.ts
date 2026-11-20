declare interface AttachmentInputTriggerVariant {
  /**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type AttachmentInputTriggerVariantMap = {
  [key in keyof AttachmentInputTriggerVariant]: Array<AttachmentInputTriggerVariant[key]>;
};

export declare type AttachmentInputTriggerVariantProps = Partial<AttachmentInputTriggerVariant>;

export declare type AttachmentInputTriggerSlotName = "root" | "icon" | "itemCountArea" | "itemCount" | "maxItemCount";

export declare const attachmentInputTriggerVariantMap: AttachmentInputTriggerVariantMap;

export declare const attachmentInputTrigger: ((
  props?: AttachmentInputTriggerVariantProps,
) => Record<AttachmentInputTriggerSlotName, string>) & {
  splitVariantProps: <T extends AttachmentInputTriggerVariantProps>(
    props: T,
  ) => [AttachmentInputTriggerVariantProps, Omit<T, keyof AttachmentInputTriggerVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const attachmentInputTriggerSeedTagSpec: {
  readonly name: "AttachmentInputTrigger";
  readonly axes: readonly [];
  readonly defaults: {};
};
