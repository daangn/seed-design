declare interface FileUploadVariant {
  
}

declare type FileUploadVariantMap = {
  [key in keyof FileUploadVariant]: Array<FileUploadVariant[key]>;
};

export declare type FileUploadVariantProps = Partial<FileUploadVariant>;

export declare type FileUploadSlotName = "root" | "dropzone" | "container" | "trigger" | "itemGroup" | "item" | "itemPreview" | "itemImage" | "itemName" | "itemSize" | "itemDeleteTrigger" | "clearTrigger";

export declare const fileUploadVariantMap: FileUploadVariantMap;

export declare const fileUpload: ((
  props?: FileUploadVariantProps,
) => Record<FileUploadSlotName, string>) & {
  splitVariantProps: <T extends FileUploadVariantProps>(
    props: T,
  ) => [FileUploadVariantProps, Omit<T, keyof FileUploadVariantProps>];
}