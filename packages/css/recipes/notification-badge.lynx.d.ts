declare interface NotificationBadgeVariant {
  /**
  * @default "large"
  */
  size: "small" | "large";
  disabled?: true;
  loading?: true;}

declare type NotificationBadgeVariantMap = {
  [key in keyof NotificationBadgeVariant]: Array<NotificationBadgeVariant[key]>;
};

export declare type NotificationBadgeVariantProps = Partial<NotificationBadgeVariant>;

export declare type NotificationBadgeSlotName = "root" | "text";

export declare const notificationBadgeVariantMap: NotificationBadgeVariantMap;

export declare const notificationBadge: ((
  props?: NotificationBadgeVariantProps,
) => Record<NotificationBadgeSlotName, string>) & {
  splitVariantProps: <T extends NotificationBadgeVariantProps>(
    props: T,
  ) => [NotificationBadgeVariantProps, Omit<T, keyof NotificationBadgeVariantProps>];
}