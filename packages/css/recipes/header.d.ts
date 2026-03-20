declare interface HeaderVariant {
  /**
  * @default "layer"
  */
  tone: "layer" | "transparent";
/**
  * @default false
  */
  divider: boolean;
}

declare type HeaderVariantMap = {
  [key in keyof HeaderVariant]: Array<HeaderVariant[key]>;
};

export declare type HeaderVariantProps = Partial<HeaderVariant>;

export declare type HeaderSlotName = "root" | "left" | "center" | "right";

export declare const headerVariantMap: HeaderVariantMap;

export declare const header: ((
  props?: HeaderVariantProps,
) => Record<HeaderSlotName, string>) & {
  splitVariantProps: <T extends HeaderVariantProps>(
    props: T,
  ) => [HeaderVariantProps, Omit<T, keyof HeaderVariantProps>];
}