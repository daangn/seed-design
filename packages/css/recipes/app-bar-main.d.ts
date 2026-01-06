declare interface AppBarMainVariant {
  /**
  * @default "titleOnly"
  */
  layout: "titleOnly" | "withSubtitle";
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
}

declare type AppBarMainVariantMap = {
  [key in keyof AppBarMainVariant]: Array<AppBarMainVariant[key]>;
};

export declare type AppBarMainVariantProps = Partial<AppBarMainVariant>;

export declare type AppBarMainSlotName = "root" | "title" | "subtitle";

export declare const appBarMainVariantMap: AppBarMainVariantMap;

export declare const appBarMain: ((
  props?: AppBarMainVariantProps,
) => Record<AppBarMainSlotName, string>) & {
  splitVariantProps: <T extends AppBarMainVariantProps>(
    props: T,
  ) => [AppBarMainVariantProps, Omit<T, keyof AppBarMainVariantProps>];
}