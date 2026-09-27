declare interface PopoverVariant {
  
}

declare type PopoverVariantMap = {
  [key in keyof PopoverVariant]: Array<PopoverVariant[key]>;
};

export declare type PopoverVariantProps = Partial<PopoverVariant>;

export declare type PopoverSlotName = "positioner" | "content" | "header" | "body" | "footer" | "title" | "description" | "closeButton";

export declare const popoverVariantMap: PopoverVariantMap;

export declare const popover: ((
  props?: PopoverVariantProps,
) => Record<PopoverSlotName, string>) & {
  splitVariantProps: <T extends PopoverVariantProps>(
    props: T,
  ) => [PopoverVariantProps, Omit<T, keyof PopoverVariantProps>];
}