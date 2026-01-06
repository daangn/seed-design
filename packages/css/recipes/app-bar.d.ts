declare interface AppBarVariant {
  /**
  * @default "cupertino"
  */
  theme: "cupertino" | "android";
/**
  * @default "slideFromRightIOS"
  */
  transitionStyle: "slideFromRightIOS" | "fadeFromBottomAndroid" | "fadeIn";
/**
  * @default "layer"
  */
  tone: "layer" | "transparent";
/**
  * @default false
  */
  divider: boolean;
}

declare type AppBarVariantMap = {
  [key in keyof AppBarVariant]: Array<AppBarVariant[key]>;
};

export declare type AppBarVariantProps = Partial<AppBarVariant>;

export declare type AppBarSlotName = "root" | "left" | "right" | "iconButton" | "icon";

export declare const appBarVariantMap: AppBarVariantMap;

export declare const appBar: ((
  props?: AppBarVariantProps,
) => Record<AppBarSlotName, string>) & {
  splitVariantProps: <T extends AppBarVariantProps>(
    props: T,
  ) => [AppBarVariantProps, Omit<T, keyof AppBarVariantProps>];
}