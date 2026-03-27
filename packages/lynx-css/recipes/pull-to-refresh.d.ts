declare interface PullToRefreshVariant {
  
}

declare type PullToRefreshVariantMap = {
  [key in keyof PullToRefreshVariant]: Array<PullToRefreshVariant[key]>;
};

export declare type PullToRefreshVariantProps = Partial<PullToRefreshVariant>;

export declare type PullToRefreshSlotName = "root" | "indicator";

export declare const pullToRefreshVariantMap: PullToRefreshVariantMap;

export declare const pullToRefresh: ((
  props?: PullToRefreshVariantProps,
) => Record<PullToRefreshSlotName, string>) & {
  splitVariantProps: <T extends PullToRefreshVariantProps>(
    props: T,
  ) => [PullToRefreshVariantProps, Omit<T, keyof PullToRefreshVariantProps>];
}