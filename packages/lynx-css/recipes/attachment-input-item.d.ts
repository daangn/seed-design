declare interface AttachmentInputItemVariant {
  /**
  * @default "general"
  */
  type: "general" | "image";
/**
  * @default false
  */
  removePressed: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  readOnly: boolean;
/**
  * @default false
  */
  dragging: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type AttachmentInputItemVariantMap = {
  [key in keyof AttachmentInputItemVariant]: Array<AttachmentInputItemVariant[key]>;
};

export declare type AttachmentInputItemVariantProps = Partial<AttachmentInputItemVariant>;

export declare type AttachmentInputItemSlotName = "root" | "surface" | "image" | "thumbnail" | "thumbnailIcon" | "metadata" | "name" | "size" | "badge" | "badgeLabel" | "backdrop" | "actionButton" | "actionIcon" | "actionLabel" | "removeButton" | "removeIcon";

export declare const attachmentInputItemVariantMap: AttachmentInputItemVariantMap;

export declare const attachmentInputItem: ((
  props?: AttachmentInputItemVariantProps,
) => Record<AttachmentInputItemSlotName, string>) & {
  splitVariantProps: <T extends AttachmentInputItemVariantProps>(
    props: T,
  ) => [AttachmentInputItemVariantProps, Omit<T, keyof AttachmentInputItemVariantProps>];
}