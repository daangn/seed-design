declare interface IdentityPlaceholderVariant {
  /**
  * @default "person"
  */
  identity: "person";
}

declare type IdentityPlaceholderVariantMap = {
  [key in keyof IdentityPlaceholderVariant]: Array<IdentityPlaceholderVariant[key]>;
};

export declare type IdentityPlaceholderVariantProps = Partial<IdentityPlaceholderVariant>;

export declare type IdentityPlaceholderSlotName = "root" | "image";

export declare const identityPlaceholderVariantMap: IdentityPlaceholderVariantMap;

export declare const identityPlaceholder: ((
  props?: IdentityPlaceholderVariantProps,
) => Record<IdentityPlaceholderSlotName, string>) & {
  splitVariantProps: <T extends IdentityPlaceholderVariantProps>(
    props: T,
  ) => [IdentityPlaceholderVariantProps, Omit<T, keyof IdentityPlaceholderVariantProps>];
}