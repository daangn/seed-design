declare interface FileUploadItemVariant {
  /**
  * @default "general"
  */
  type: "general" | "image";
}

declare type FileUploadItemVariantMap = {
  [key in keyof FileUploadItemVariant]: Array<FileUploadItemVariant[key]>;
};

export declare type FileUploadItemVariantProps = Partial<FileUploadItemVariant>;

export declare type FileUploadItemSlotName = "root" | "image" | "thumbnail" | "metadata" | "name" | "size" | "backdrop" | "actionButton";

export declare const fileUploadItemVariantMap: FileUploadItemVariantMap;

export declare const fileUploadItem: ((
  props?: FileUploadItemVariantProps,
) => Record<FileUploadItemSlotName, string>) & {
  splitVariantProps: <T extends FileUploadItemVariantProps>(
    props: T,
  ) => [FileUploadItemVariantProps, Omit<T, keyof FileUploadItemVariantProps>];
}