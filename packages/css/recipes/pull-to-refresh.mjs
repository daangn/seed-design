import './pull-to-refresh.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(pullToRefreshSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(pullToRefresh, { splitVariantProps: (props) => splitVariantProps(props, pullToRefreshVariantMap) });

// @recipe(seed): pull-to-refresh