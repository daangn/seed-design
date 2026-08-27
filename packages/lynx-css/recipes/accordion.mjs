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
    "header",
    "seed-accordion__header"
  ],
  [
    "trigger",
    "seed-accordion__trigger"
  ],
  [
    "pressedOverlay",
    "seed-accordion__pressedOverlay"
  ],
  [
    "prefix",
    "seed-accordion__prefix"
  ],
  [
    "body",
    "seed-accordion__body"
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
  ],
  [
    "divider",
    "seed-accordion__divider"
  ]
];

const defaultVariant = {
  "variant": "inline",
  "size": "medium",
  "open": false,
  "pressed": false,
  "disabled": false
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
  ],
  "open": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
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