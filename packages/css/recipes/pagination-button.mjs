import './pagination-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const paginationButtonVariantMap = {};

export const paginationButtonVariantKeys = Object.keys(paginationButtonVariantMap);

export function paginationButton(props) {
  return createClassName(
    "seed-pagination-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(paginationButton, { splitVariantProps: (props) => splitVariantProps(props, paginationButtonVariantMap) });

// @recipe(seed): pagination-button