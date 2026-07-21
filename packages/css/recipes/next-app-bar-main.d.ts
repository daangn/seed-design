declare interface NextAppBarMainVariant {
  /**
  * @default "titleOnly"
  */
  layout: "titleOnly" | "withSubtitle";
/**
  * @default "cupertino"
  */
  theme: "cupertino" | "android";
/**
  * @default "horizontalSlide"
  */
  transitionStyle: "horizontalSlide" | "verticalSlide" | "fadeIn";
/**
  * @default "layer"
  */
  tone: "layer" | "transparent";
}

declare type NextAppBarMainVariantMap = {
  [key in keyof NextAppBarMainVariant]: Array<NextAppBarMainVariant[key]>;
};

export declare type NextAppBarMainVariantProps = Partial<NextAppBarMainVariant>;

export declare type NextAppBarMainSlotName = "root" | "title" | "subtitle";

export declare const nextAppBarMainVariantMap: NextAppBarMainVariantMap;

export declare const nextAppBarMain: ((
  props?: NextAppBarMainVariantProps,
) => Record<NextAppBarMainSlotName, string>) & {
  splitVariantProps: <T extends NextAppBarMainVariantProps>(
    props: T,
  ) => [NextAppBarMainVariantProps, Omit<T, keyof NextAppBarMainVariantProps>];
}