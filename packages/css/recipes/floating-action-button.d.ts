declare interface FloatingActionButtonVariant {
  /**
  * @default true
  */
  extended: boolean;
}

declare type FloatingActionButtonVariantMap = {
  [key in keyof FloatingActionButtonVariant]: Array<FloatingActionButtonVariant[key]>;
};

export declare type FloatingActionButtonVariantProps = Partial<FloatingActionButtonVariant>;

export declare type FloatingActionButtonSlotName = "root" | "icon" | "label";

export declare const floatingActionButtonVariantMap: FloatingActionButtonVariantMap;

export declare const floatingActionButton: ((
  props?: FloatingActionButtonVariantProps,
) => Record<FloatingActionButtonSlotName, string>) & {
  splitVariantProps: <T extends FloatingActionButtonVariantProps>(
    props: T,
  ) => [FloatingActionButtonVariantProps, Omit<T, keyof FloatingActionButtonVariantProps>];
}