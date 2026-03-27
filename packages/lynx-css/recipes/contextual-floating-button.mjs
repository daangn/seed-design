import './contextual-floating-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contextualFloatingButtonSlotNames = [
  [
    "root",
    "seed-contextual-floating-button"
  ],
  [
    "text",
    "seed-contextual-floating-button__text"
  ]
];

const defaultVariant = {
  "variant": "solid",
  "layout": "withText"
};

const compoundVariants = [];

export const contextualFloatingButtonVariantMap = {
  "variant": [
    "solid",
    "layer"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
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