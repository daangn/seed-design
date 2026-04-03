import './accordion.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const accordionSlotNames = [
  [
    "root",
    "seed-accordion__root"
  ],
  [
    "item",
    "seed-accordion__item"
  ],
  [
    "trigger",
    "seed-accordion__trigger"
  ],
  [
    "prefixIcon",
    "seed-accordion__prefixIcon"
  ],
  [
    "prefixAvatar",
    "seed-accordion__prefixAvatar"
  ],
  [
    "title",
    "seed-accordion__title"
  ],
  [
    "description",
    "seed-accordion__description"
  ],
  [
    "suffixIcon",
    "seed-accordion__suffixIcon"
  ],
  [
    "content",
    "seed-accordion__content"
  ],
  [
    "contentInner",
    "seed-accordion__contentInner"
  ]
];

const defaultVariant = {
  "variant": "inline",
  "size": "medium"
};

const compoundVariants = [
  {
    "variant": "separated",
    "size": "medium"
  },
  {
    "variant": "separated",
    "size": "large"
  }
];

export const accordionVariantMap = {
  "variant": [
    "inline",
    "separated"
  ],
  "size": [
    "medium",
    "large"
  ]
};

export const accordionVariantKeys = Object.keys(accordionVariantMap);

export function accordion(props) {
  return Object.fromEntries(
    accordionSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(accordion, { splitVariantProps: (props) => splitVariantProps(props, accordionVariantMap) });

// @recipe(seed): accordion