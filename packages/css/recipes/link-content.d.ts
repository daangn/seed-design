declare interface LinkContentVariant {
  weight: "bold" | "regular";
/**
  * @default t4
  */
  size: "t6" | "t5" | "t4";
}

declare type LinkContentVariantMap = {
  [key in keyof LinkContentVariant]: Array<LinkContentVariant[key]>;
};

export declare type LinkContentVariantProps = Partial<LinkContentVariant>;

export declare type LinkContentSlotName = "root";

export declare const linkContentVariantMap: LinkContentVariantMap;

export declare const linkContent: ((
  props?: LinkContentVariantProps,
) => Record<LinkContentSlotName, string>) & {
  splitVariantProps: <T extends LinkContentVariantProps>(
    props: T,
  ) => [LinkContentVariantProps, Omit<T, keyof LinkContentVariantProps>];
}