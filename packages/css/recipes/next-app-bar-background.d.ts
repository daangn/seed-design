declare interface NextAppBarBackgroundVariant {
  /**
  * @default "progressiveBlur"
  */
  material: "progressiveBlur" | "transparent" | "translucent";
}

declare type NextAppBarBackgroundVariantMap = {
  [key in keyof NextAppBarBackgroundVariant]: Array<NextAppBarBackgroundVariant[key]>;
};

export declare type NextAppBarBackgroundVariantProps = Partial<NextAppBarBackgroundVariant>;

export declare type NextAppBarBackgroundSlotName = "root" | "blur" | "tint";

export declare const nextAppBarBackgroundVariantMap: NextAppBarBackgroundVariantMap;

export declare const nextAppBarBackground: ((
  props?: NextAppBarBackgroundVariantProps,
) => Record<NextAppBarBackgroundSlotName, string>) & {
  splitVariantProps: <T extends NextAppBarBackgroundVariantProps>(
    props: T,
  ) => [NextAppBarBackgroundVariantProps, Omit<T, keyof NextAppBarBackgroundVariantProps>];
}