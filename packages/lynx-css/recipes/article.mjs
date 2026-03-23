import './article.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const articleSlotNames = [
  [
    "root",
    "seed-article"
  ],
  [
    "text",
    "seed-article__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const articleVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const articleVariantKeys = Object.keys(articleVariantMap);

export function article(props) {
  return Object.fromEntries(
    articleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(article, { splitVariantProps: (props) => splitVariantProps(props, articleVariantMap) });

// @recipe(seed): article