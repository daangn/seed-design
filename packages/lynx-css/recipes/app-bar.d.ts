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
}

declare type AppBarVariantMap = {
  [key in keyof AppBarVariant]: Array<AppBarVariant[key]>;
};

export declare type AppBarVariantProps = Partial<AppBarVariant>;

export declare type AppBarSlotName = "root" | "background" | "left" | "right" | "iconButton" | "icon" | "textButton" | "textButtonLabel" | "custom";

export declare const appBarVariantMap: AppBarVariantMap;

export declare const appBar: ((
  props?: AppBarVariantProps,
) => Record<AppBarSlotName, string>) & {
  splitVariantProps: <T extends AppBarVariantProps>(
    props: T,
  ) => [AppBarVariantProps, Omit<T, keyof AppBarVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const appBarSeedTagSpec: {
  readonly name: "TopNavigation";
  readonly axes: readonly ["theme", "tone", "gradient", "titleLayout"];
  readonly defaults: { readonly theme: "cupertino"; readonly tone: "layer" };
};
