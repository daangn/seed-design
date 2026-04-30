declare interface NotificationBadgeVariant {
  /**
  * - `small`: 간결한 도트 형태로, 텍스트 없이 상태 변화만 표시합니다.
  * - `large`: 라벨을 포함해 구체적인 알림 수나 상태 정보를 제공합니다.
  *
  * @default "large"
  */
  size: "small" | "large";
}

declare type NotificationBadgeVariantMap = {
  [key in keyof NotificationBadgeVariant]: Array<NotificationBadgeVariant[key]>;
};

export declare type NotificationBadgeVariantProps = Partial<NotificationBadgeVariant>;

export declare const notificationBadgeVariantMap: NotificationBadgeVariantMap;

export declare const notificationBadge: ((
  props?: NotificationBadgeVariantProps,
) => string) & {
  splitVariantProps: <T extends NotificationBadgeVariantProps>(
    props: T,
  ) => [NotificationBadgeVariantProps, Omit<T, keyof NotificationBadgeVariantProps>];
}