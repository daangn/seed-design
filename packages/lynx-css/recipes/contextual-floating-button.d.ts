declare interface ContextualFloatingButtonVariant {
  /**
  * @default "solid"
  */
  variant: "solid" | "layer";
/**
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  loading: boolean;
}

declare type ContextualFloatingButtonVariantMap = {
  [key in keyof ContextualFloatingButtonVariant]: Array<ContextualFloatingButtonVariant[key]>;
};

export declare type ContextualFloatingButtonVariantProps = Partial<ContextualFloatingButtonVariant>;

export declare type ContextualFloatingButtonSlotName = "root" | "content" | "text" | "prefixIcon" | "icon" | "loadingIndicator";

export declare const contextualFloatingButtonVariantMap: ContextualFloatingButtonVariantMap;

export declare const contextualFloatingButton: ((
  props?: ContextualFloatingButtonVariantProps,
) => Record<ContextualFloatingButtonSlotName, string>) & {
  splitVariantProps: <T extends ContextualFloatingButtonVariantProps>(
    props: T,
  ) => [ContextualFloatingButtonVariantProps, Omit<T, keyof ContextualFloatingButtonVariantProps>];
}