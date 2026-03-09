declare interface ContextualFloatingButtonVariant {
  /**
  * @default "solid"
  */
  variant: "solid" | "layer";
/**
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
  disabled?: boolean;
  loading?: boolean;}

declare type ContextualFloatingButtonVariantMap = {
  [key in keyof ContextualFloatingButtonVariant]: Array<ContextualFloatingButtonVariant[key]>;
};

export declare type ContextualFloatingButtonVariantProps = Partial<ContextualFloatingButtonVariant>;

export declare type ContextualFloatingButtonSlotName = "root" | "text";

export declare const contextualFloatingButtonVariantMap: ContextualFloatingButtonVariantMap;

export declare const contextualFloatingButton: ((
  props?: ContextualFloatingButtonVariantProps,
) => Record<ContextualFloatingButtonSlotName, string>) & {
  splitVariantProps: <T extends ContextualFloatingButtonVariantProps>(
    props: T,
  ) => [ContextualFloatingButtonVariantProps, Omit<T, keyof ContextualFloatingButtonVariantProps>];
}