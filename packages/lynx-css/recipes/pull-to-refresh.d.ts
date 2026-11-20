declare interface PullToRefreshVariant {
  
}

declare type PullToRefreshVariantMap = {
  [key in keyof PullToRefreshVariant]: Array<PullToRefreshVariant[key]>;
};

export declare type PullToRefreshVariantProps = Partial<PullToRefreshVariant>;

export declare type PullToRefreshSlotName = "root" | "indicator" | "content";

export declare const pullToRefreshVariantMap: PullToRefreshVariantMap;

export declare const pullToRefresh: ((
  props?: PullToRefreshVariantProps,
) => Record<PullToRefreshSlotName, string>) & {
  splitVariantProps: <T extends PullToRefreshVariantProps>(
    props: T,
  ) => [PullToRefreshVariantProps, Omit<T, keyof PullToRefreshVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const pullToRefreshSeedTagSpec: {
  readonly name: "PullToRefresh";
  readonly axes: readonly [];
  readonly defaults: {};
};
