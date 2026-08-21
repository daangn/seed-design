declare interface PaginationPageItemVariant {
  
}

declare type PaginationPageItemVariantMap = {
  [key in keyof PaginationPageItemVariant]: Array<PaginationPageItemVariant[key]>;
};

export declare type PaginationPageItemVariantProps = Partial<PaginationPageItemVariant>;

export declare const paginationPageItemVariantMap: PaginationPageItemVariantMap;

export declare const paginationPageItem: ((
  props?: PaginationPageItemVariantProps,
) => string) & {
  splitVariantProps: <T extends PaginationPageItemVariantProps>(
    props: T,
  ) => [PaginationPageItemVariantProps, Omit<T, keyof PaginationPageItemVariantProps>];
}