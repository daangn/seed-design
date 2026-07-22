declare interface NextAppScreenVariant {
  /**
  * @default "cupertino"
  */
  theme: "cupertino" | "android";
/**
  * @default "horizontalSlide"
  */
  transitionStyle: "horizontalSlide" | "verticalSlide" | "crossfade";
/**
  * @default "appBar"
  */
  contentOffsetTop: "none" | "safeArea" | "appBar";
/**
  * @default "none"
  */
  contentOffsetBottom: "none" | "safeArea";
/**
  * @default "layer"
  */
  tone: "layer" | "transparent";
/**
  * @default true
  */
  gradient: boolean;
}

declare type NextAppScreenVariantMap = {
  [key in keyof NextAppScreenVariant]: Array<NextAppScreenVariant[key]>;
};

export declare type NextAppScreenVariantProps = Partial<NextAppScreenVariant>;

export declare type NextAppScreenSlotName = "root" | "dim" | "layer" | "content" | "edge";

export declare const nextAppScreenVariantMap: NextAppScreenVariantMap;

export declare const nextAppScreen: ((
  props?: NextAppScreenVariantProps,
) => Record<NextAppScreenSlotName, string>) & {
  splitVariantProps: <T extends NextAppScreenVariantProps>(
    props: T,
  ) => [NextAppScreenVariantProps, Omit<T, keyof NextAppScreenVariantProps>];
}