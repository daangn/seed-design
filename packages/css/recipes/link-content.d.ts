declare interface LinkContentVariant {
  /**
  * @default "regular"
  */
  weight: "bold" | "regular";
/**
  * @default "t4"
  */
  size: "t6" | "t5" | "t4";
}

declare type LinkContentVariantMap = {
  [key in keyof LinkContentVariant]: Array<LinkContentVariant[key]>;
};

export declare type LinkContentVariantProps = Partial<LinkContentVariant>;

export declare const linkContentVariantMap: LinkContentVariantMap;

export declare const linkContent: ((
  props?: LinkContentVariantProps,
) => string) & {
  splitVariantProps: <T extends LinkContentVariantProps>(
    props: T,
  ) => [LinkContentVariantProps, Omit<T, keyof LinkContentVariantProps>];
}