import './checkmark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const checkmarkSlotNames = [
  [
    "root",
    "seed-checkmark__root"
  ],
  [
    "icon",
    "seed-checkmark__icon"
  ]
];

const defaultVariant = {
  "variant": "square",
  "tone": "brand",
  "size": "medium"
};

const compoundVariants = [
  {
    "variant": "square",
    "tone": "neutral"
  },
  {
    "variant": "square",
    "tone": "brand"
  },
  {
    "variant": "ghost",
    "tone": "neutral"
  },
  {
    "variant": "ghost",
    "tone": "brand"
  },
  {
    "size": "medium",
    "variant": "ghost"
  },
  {
    "size": "large",
    "variant": "ghost"
  },
  {
    "size": "medium",
    "variant": "square"
  },
  {
    "size": "large",
    "variant": "square"
  }
];

export const checkmarkVariantMap = {
  "variant": [
    "square",
    "ghost"
  ],
  "tone": [
    "neutral",
    "brand"
  ],
  "size": [
    "large",
    "medium"
  ]
};

export const checkmarkVariantKeys = Object.keys(checkmarkVariantMap);

export function checkmark(props) {
  return Object.fromEntries(
    checkmarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkmark, { splitVariantProps: (props) => splitVariantProps(props, checkmarkVariantMap) });

// @recipe(seed): checkmark