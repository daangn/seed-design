import './contextual-floating-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contextualFloatingButtonSlotNames = [
  [
    "root",
    "seed-contextual-floating-button__root"
  ],
  [
    "content",
    "seed-contextual-floating-button__content"
  ],
  [
    "text",
    "seed-contextual-floating-button__text"
  ],
  [
    "prefixIcon",
    "seed-contextual-floating-button__prefixIcon"
  ],
  [
    "icon",
    "seed-contextual-floating-button__icon"
  ],
  [
    "loadingIndicator",
    "seed-contextual-floating-button__loadingIndicator"
  ]
];

const defaultVariant = {
  "variant": "solid",
  "layout": "withText",
  "pressed": false,
  "disabled": false,
  "loading": false
};

const compoundVariants = [
  {
    "variant": "solid",
    "pressed": true
  },
  {
    "variant": "layer",
    "pressed": true
  },
  {
    "variant": "solid",
    "disabled": true
  },
  {
    "variant": "layer",
    "disabled": true
  },
  {
    "variant": "solid",
    "loading": true
  },
  {
    "variant": "layer",
    "loading": true
  }
];

export const contextualFloatingButtonVariantMap = {
  "variant": [
    "solid",
    "layer"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "loading": [
    true,
    false
  ]
};

export const contextualFloatingButtonVariantKeys = Object.keys(contextualFloatingButtonVariantMap);

export function contextualFloatingButton(props) {
  return Object.fromEntries(
    contextualFloatingButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(contextualFloatingButton, { splitVariantProps: (props) => splitVariantProps(props, contextualFloatingButtonVariantMap) });

// @recipe(seed): contextual-floating-button