import './manner-temp-badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "level": "l1"
};

const compoundVariants = [];

export const mannerTempBadgeVariantMap = {
  "level": [
    "l1",
    "l2",
    "l3",
    "l4",
    "l5",
    "l6",
    "l7",
    "l8",
    "l9",
    "l10"
  ]
};

export const mannerTempBadgeVariantKeys = Object.keys(mannerTempBadgeVariantMap);

export function mannerTempBadge(props) {
  return createClassName(
    "seed-manner-temp-badge",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(mannerTempBadge, { splitVariantProps: (props) => splitVariantProps(props, mannerTempBadgeVariantMap) });

// @recipe(seed): manner-temp-badge