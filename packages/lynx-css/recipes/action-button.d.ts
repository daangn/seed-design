declare interface ActionButtonVariant {
  /**
  * @default "brandSolid"
  */
  variant: "brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid" | "brandOutline" | "neutralOutline" | "ghost";
/**
  * @default "medium"
  */
  size: "xsmall" | "small" | "medium" | "large";
/**
  * @default "withText"
  */
  layout: "withText" | "iconOnly";
}

declare type ActionButtonVariantMap = {
  [key in keyof ActionButtonVariant]: Array<ActionButtonVariant[key]>;
};

export declare type ActionButtonVariantProps = Partial<ActionButtonVariant>;

export declare const actionButtonVariantMap: ActionButtonVariantMap;

export declare const actionButton: ((
  props?: ActionButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ActionButtonVariantProps>(
    props: T,
  ) => [ActionButtonVariantProps, Omit<T, keyof ActionButtonVariantProps>];
}