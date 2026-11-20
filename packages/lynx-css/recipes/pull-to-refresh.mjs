import './pull-to-refresh.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const pullToRefreshSlotNames = [
  [
    "root",
    "seed-pull-to-refresh__root"
  ],
  [
    "indicator",
    "seed-pull-to-refresh__indicator"
  ],
  [
    "content",
    "seed-pull-to-refresh__content"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const pullToRefreshVariantMap = {};

export const pullToRefreshVariantKeys = Object.keys(pullToRefreshVariantMap);

export function pullToRefresh(props) {
  return Object.fromEntries(
    pullToRefreshSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(pullToRefresh, { splitVariantProps: (props) => splitVariantProps(props, pullToRefreshVariantMap) });

// @recipe(seed): pull-to-refresh

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const pullToRefreshSeedTagSpec = {
  name: "PullToRefresh",
  axes: [],
  defaults: {},
};
