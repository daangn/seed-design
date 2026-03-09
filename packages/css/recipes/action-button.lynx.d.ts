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
  disabled?: true;
  loading?: true;}

declare type ActionButtonVariantMap = {
  [key in keyof ActionButtonVariant]: Array<ActionButtonVariant[key]>;
};

export declare type ActionButtonVariantProps = Partial<ActionButtonVariant>;

export declare type ActionButtonSlotName = "root" | "text";

export declare const actionButtonVariantMap: ActionButtonVariantMap;

export declare const actionButton: ((
  props?: ActionButtonVariantProps,
) => Record<ActionButtonSlotName, string>) & {
  splitVariantProps: <T extends ActionButtonVariantProps>(
    props: T,
  ) => [ActionButtonVariantProps, Omit<T, keyof ActionButtonVariantProps>];
}