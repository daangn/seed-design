declare interface ArticleVariant {
  
}

declare type ArticleVariantMap = {
  [key in keyof ArticleVariant]: Array<ArticleVariant[key]>;
};

export declare type ArticleVariantProps = Partial<ArticleVariant>;

export declare const articleVariantMap: ArticleVariantMap;

export declare const article: ((
  props?: ArticleVariantProps,
) => string) & {
  splitVariantProps: <T extends ArticleVariantProps>(
    props: T,
  ) => [ArticleVariantProps, Omit<T, keyof ArticleVariantProps>];
}