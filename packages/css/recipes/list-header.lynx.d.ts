declare interface ListHeaderVariant {
  /**
  * @default "mediumWeak"
  */
  variant: "mediumWeak" | "boldSolid";
  disabled?: boolean;
  loading?: boolean;}

declare type ListHeaderVariantMap = {
  [key in keyof ListHeaderVariant]: Array<ListHeaderVariant[key]>;
};

export declare type ListHeaderVariantProps = Partial<ListHeaderVariant>;

export declare type ListHeaderSlotName = "root" | "text";

export declare const listHeaderVariantMap: ListHeaderVariantMap;

export declare const listHeader: ((
  props?: ListHeaderVariantProps,
) => Record<ListHeaderSlotName, string>) & {
  splitVariantProps: <T extends ListHeaderVariantProps>(
    props: T,
  ) => [ListHeaderVariantProps, Omit<T, keyof ListHeaderVariantProps>];
}