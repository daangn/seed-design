import './list.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const listVariantMap = {};

export const listVariantKeys = Object.keys(listVariantMap);

export function list(props) {
  return createClassName(
    "seed-list",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(list, { splitVariantProps: (props) => splitVariantProps(props, listVariantMap) });

// @recipe(seed): list