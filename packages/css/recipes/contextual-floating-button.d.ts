declare interface ContextualFloatingButtonVariant {
  /**
  * @default "solid"
  */
  variant: "solid" | "layer";
/**
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
}

declare type ContextualFloatingButtonVariantMap = {
  [key in keyof ContextualFloatingButtonVariant]: Array<ContextualFloatingButtonVariant[key]>;
};

export declare type ContextualFloatingButtonVariantProps = Partial<ContextualFloatingButtonVariant>;

export declare const contextualFloatingButtonVariantMap: ContextualFloatingButtonVariantMap;

export declare const contextualFloatingButton: ((
  props?: ContextualFloatingButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ContextualFloatingButtonVariantProps>(
    props: T,
  ) => [ContextualFloatingButtonVariantProps, Omit<T, keyof ContextualFloatingButtonVariantProps>];
}