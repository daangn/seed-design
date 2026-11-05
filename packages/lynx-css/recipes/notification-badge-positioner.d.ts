declare interface NotificationBadgePositionerVariant {
  /**
  * @default "icon"
  */
  attach: "icon" | "text";
/**
  * @default "large"
  */
  size: "small" | "large";
}

declare type NotificationBadgePositionerVariantMap = {
  [key in keyof NotificationBadgePositionerVariant]: Array<NotificationBadgePositionerVariant[key]>;
};

export declare type NotificationBadgePositionerVariantProps = Partial<NotificationBadgePositionerVariant>;

export declare const notificationBadgePositionerVariantMap: NotificationBadgePositionerVariantMap;

export declare const notificationBadgePositioner: ((
  props?: NotificationBadgePositionerVariantProps,
) => string) & {
  splitVariantProps: <T extends NotificationBadgePositionerVariantProps>(
    props: T,
  ) => [NotificationBadgePositionerVariantProps, Omit<T, keyof NotificationBadgePositionerVariantProps>];
}