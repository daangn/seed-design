declare interface FooterVariant {
  /**
  * @default "medium"
  */
  size: "large" | "medium";
}

declare type FooterVariantMap = {
  [key in keyof FooterVariant]: Array<FooterVariant[key]>;
};

export declare type FooterVariantProps = Partial<FooterVariant>;

export declare type FooterSlotName = "linkText";

export declare const footerVariantMap: FooterVariantMap;

export declare const footer: ((
  props?: FooterVariantProps,
) => Record<FooterSlotName, string>) & {
  splitVariantProps: <T extends FooterVariantProps>(
    props: T,
  ) => [FooterVariantProps, Omit<T, keyof FooterVariantProps>];
}