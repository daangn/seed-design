import './drawer.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const drawerSlotNames = [
  [
    "positioner",
    "seed-drawer__positioner"
  ],
  [
    "backdrop",
    "seed-drawer__backdrop"
  ],
  [
    "content",
    "seed-drawer__content"
  ],
  [
    "header",
    "seed-drawer__header"
  ],
  [
    "body",
    "seed-drawer__body"
  ],
  [
    "footer",
    "seed-drawer__footer"
  ],
  [
    "title",
    "seed-drawer__title"
  ],
  [
    "description",
    "seed-drawer__description"
  ],
  [
    "closeButton",
    "seed-drawer__closeButton"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const drawerVariantMap = {
  "size": [
    "small",
    "medium",
    "large"
  ]
};

export const drawerVariantKeys = Object.keys(drawerVariantMap);

export function drawer(props) {
  return Object.fromEntries(
    drawerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(drawer, { splitVariantProps: (props) => splitVariantProps(props, drawerVariantMap) });

// @recipe(seed): drawer