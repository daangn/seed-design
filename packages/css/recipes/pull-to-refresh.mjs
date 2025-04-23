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