import './article.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const articleVariantMap = {};

export const articleVariantKeys = Object.keys(articleVariantMap);

export function article(props) {
  return createClassName(
    "seed-article",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(article, { splitVariantProps: (props) => splitVariantProps(props, articleVariantMap) });

// @recipe(seed): article