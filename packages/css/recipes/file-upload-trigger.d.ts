declare interface FileUploadTriggerVariant {
  
}

declare type FileUploadTriggerVariantMap = {
  [key in keyof FileUploadTriggerVariant]: Array<FileUploadTriggerVariant[key]>;
};

export declare type FileUploadTriggerVariantProps = Partial<FileUploadTriggerVariant>;

export declare type FileUploadTriggerSlotName = "root" | "icon" | "itemCountArea" | "itemCount" | "maxItemCount";

export declare const fileUploadTriggerVariantMap: FileUploadTriggerVariantMap;

export declare const fileUploadTrigger: ((
  props?: FileUploadTriggerVariantProps,
) => Record<FileUploadTriggerSlotName, string>) & {
  splitVariantProps: <T extends FileUploadTriggerVariantProps>(
    props: T,
  ) => [FileUploadTriggerVariantProps, Omit<T, keyof FileUploadTriggerVariantProps>];
}