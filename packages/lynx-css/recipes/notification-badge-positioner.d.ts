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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const notificationBadgePositionerSeedTagSpec: {
  readonly name: "NotificationBadgePositioner";
  readonly axes: readonly [];
  readonly defaults: {};
};
