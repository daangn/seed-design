declare interface NextAppBarVariant {
  /**
  * @default "cupertino"
  */
  theme: "cupertino" | "android";
/**
  * @default "horizontalSlide"
  */
  transitionStyle: "horizontalSlide" | "verticalSlide" | "crossfade" | "experimental_scaleSlide";
/**
  * @default "layer"
  */
  tone: "layer" | "transparent";
/**
  * @default true
  */
  gradient: boolean;
}

declare type NextAppBarVariantMap = {
  [key in keyof NextAppBarVariant]: Array<NextAppBarVariant[key]>;
};

export declare type NextAppBarVariantProps = Partial<NextAppBarVariant>;

export declare type NextAppBarSlotName = "root" | "background" | "left" | "right" | "iconButton" | "icon";

export declare const nextAppBarVariantMap: NextAppBarVariantMap;

export declare const nextAppBar: ((
  props?: NextAppBarVariantProps,
) => Record<NextAppBarSlotName, string>) & {
  splitVariantProps: <T extends NextAppBarVariantProps>(
    props: T,
  ) => [NextAppBarVariantProps, Omit<T, keyof NextAppBarVariantProps>];
}