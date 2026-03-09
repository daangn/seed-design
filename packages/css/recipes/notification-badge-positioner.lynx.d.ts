declare interface NotificationBadgePositionerVariant {
  /**
  * @default "icon"
  */
  attach: "icon" | "text";
/**
  * @default "large"
  */
  size: "small" | "large";
  disabled?: true;
  loading?: true;}

declare type NotificationBadgePositionerVariantMap = {
  [key in keyof NotificationBadgePositionerVariant]: Array<NotificationBadgePositionerVariant[key]>;
};

export declare type NotificationBadgePositionerVariantProps = Partial<NotificationBadgePositionerVariant>;

export declare type NotificationBadgePositionerSlotName = "root" | "text";

export declare const notificationBadgePositionerVariantMap: NotificationBadgePositionerVariantMap;

export declare const notificationBadgePositioner: ((
  props?: NotificationBadgePositionerVariantProps,
) => Record<NotificationBadgePositionerSlotName, string>) & {
  splitVariantProps: <T extends NotificationBadgePositionerVariantProps>(
    props: T,
  ) => [NotificationBadgePositionerVariantProps, Omit<T, keyof NotificationBadgePositionerVariantProps>];
}