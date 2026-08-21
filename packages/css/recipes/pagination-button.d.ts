declare interface PaginationButtonVariant {
  
}

declare type PaginationButtonVariantMap = {
  [key in keyof PaginationButtonVariant]: Array<PaginationButtonVariant[key]>;
};

export declare type PaginationButtonVariantProps = Partial<PaginationButtonVariant>;

export declare const paginationButtonVariantMap: PaginationButtonVariantMap;

export declare const paginationButton: ((
  props?: PaginationButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends PaginationButtonVariantProps>(
    props: T,
  ) => [PaginationButtonVariantProps, Omit<T, keyof PaginationButtonVariantProps>];
}