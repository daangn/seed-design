declare interface FileUploadItemRemoveButtonVariant {
  
}

declare type FileUploadItemRemoveButtonVariantMap = {
  [key in keyof FileUploadItemRemoveButtonVariant]: Array<FileUploadItemRemoveButtonVariant[key]>;
};

export declare type FileUploadItemRemoveButtonVariantProps = Partial<FileUploadItemRemoveButtonVariant>;

export declare const fileUploadItemRemoveButtonVariantMap: FileUploadItemRemoveButtonVariantMap;

export declare const fileUploadItemRemoveButton: ((
  props?: FileUploadItemRemoveButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends FileUploadItemRemoveButtonVariantProps>(
    props: T,
  ) => [FileUploadItemRemoveButtonVariantProps, Omit<T, keyof FileUploadItemRemoveButtonVariantProps>];
}