declare interface AttachmentInputTriggerVariant {
  
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