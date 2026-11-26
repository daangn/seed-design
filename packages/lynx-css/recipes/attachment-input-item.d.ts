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

export declare type AttachmentInputItemSlotName = "root" | "surface" | "image" | "thumbnail" | "thumbnailIcon" | "metadata" | "name" | "size" | "badge" | "badgeLabel" | "durationBadge" | "durationBadgeLabel" | "backdrop" | "actionButton" | "actionIcon" | "actionLabel" | "removeButton" | "removeIcon";

export declare const attachmentInputItemVariantMap: AttachmentInputItemVariantMap;

export declare const attachmentInputItem: ((
  props?: AttachmentInputItemVariantProps,
) => Record<AttachmentInputItemSlotName, string>) & {
  splitVariantProps: <T extends AttachmentInputItemVariantProps>(
    props: T,
  ) => [AttachmentInputItemVariantProps, Omit<T, keyof AttachmentInputItemVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const attachmentInputItemSeedTagSpec: {
  readonly name: "AttachmentInputItem";
  readonly axes: readonly ["type"];
  readonly defaults: { readonly type: "general" };
};
