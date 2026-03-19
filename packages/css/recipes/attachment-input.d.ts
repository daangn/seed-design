declare interface AttachmentInputVariant {
  
}

declare type AttachmentInputVariantMap = {
  [key in keyof AttachmentInputVariant]: Array<AttachmentInputVariant[key]>;
};

export declare type AttachmentInputVariantProps = Partial<AttachmentInputVariant>;

export declare type AttachmentInputSlotName = "root" | "dropzone" | "dropzoneLabel" | "container" | "itemGroup";

export declare const attachmentInputVariantMap: AttachmentInputVariantMap;

export declare const attachmentInput: ((
  props?: AttachmentInputVariantProps,
) => Record<AttachmentInputSlotName, string>) & {
  splitVariantProps: <T extends AttachmentInputVariantProps>(
    props: T,
  ) => [AttachmentInputVariantProps, Omit<T, keyof AttachmentInputVariantProps>];
}