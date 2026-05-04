declare interface AttachmentInputItemVariant {
  /**
  * @default "general"
  */
  type: "general" | "image";
}

declare type AttachmentInputItemVariantMap = {
  [key in keyof AttachmentInputItemVariant]: Array<AttachmentInputItemVariant[key]>;
};

export declare type AttachmentInputItemVariantProps = Partial<AttachmentInputItemVariant>;

export declare type AttachmentInputItemSlotName = "root" | "image" | "thumbnail" | "metadata" | "name" | "size" | "badge" | "badgeLabel" | "backdrop" | "actionButton" | "removeButton";

export declare const attachmentInputItemVariantMap: AttachmentInputItemVariantMap;

export declare const attachmentInputItem: ((
  props?: AttachmentInputItemVariantProps,
) => Record<AttachmentInputItemSlotName, string>) & {
  splitVariantProps: <T extends AttachmentInputItemVariantProps>(
    props: T,
  ) => [AttachmentInputItemVariantProps, Omit<T, keyof AttachmentInputItemVariantProps>];
}