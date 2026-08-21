import './pagination-page-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const paginationPageItemVariantMap = {};

export const paginationPageItemVariantKeys = Object.keys(paginationPageItemVariantMap);

export function paginationPageItem(props) {
  return createClassName(
    "seed-pagination-page-item",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(paginationPageItem, { splitVariantProps: (props) => splitVariantProps(props, paginationPageItemVariantMap) });

// @recipe(seed): pagination-page-item