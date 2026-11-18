declare interface FloatingActionButtonVariant {
  /**
  * @default true
  */
  extended: boolean;
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
  transitionEnabled: boolean;
glass: boolean;
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

// Generated from Rootage component specs and color tokens by scripts/generate-glass-tint.mjs. Do not edit directly.
// Liquid Glass tint (`root.color`) per variant and state, resolved for each color scheme.
export interface GlassTint {
  light: string;
  dark: string;
}

export declare const glassTint: {
  base: {
    enabled: GlassTint;
    pressed: GlassTint;
  };
};
