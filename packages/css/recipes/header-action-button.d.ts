declare interface HeaderActionButtonVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
}

declare type HeaderActionButtonVariantMap = {
  [key in keyof HeaderActionButtonVariant]: Array<HeaderActionButtonVariant[key]>;
};

export declare type HeaderActionButtonVariantProps = Partial<HeaderActionButtonVariant>;

export declare const headerActionButtonVariantMap: HeaderActionButtonVariantMap;

export declare const headerActionButton: ((
  props?: HeaderActionButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends HeaderActionButtonVariantProps>(
    props: T,
  ) => [HeaderActionButtonVariantProps, Omit<T, keyof HeaderActionButtonVariantProps>];
}