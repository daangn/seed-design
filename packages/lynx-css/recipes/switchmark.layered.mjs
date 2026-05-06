import './switchmark.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const switchmarkSlotNames = [
  [
    "root",
    "seed-switchmark__root"
  ],
  [
    "thumb",
    "seed-switchmark__thumb"
  ]
];

const defaultVariant = {
  "tone": "brand",
  "size": 32,
  "checked": false,
  "disabled": false
};

const compoundVariants = [
  {
    "tone": "brand",
    "checked": true
  },
  {
    "tone": "neutral",
    "checked": true,
    "disabled": false
  },
  {
    "tone": "neutral",
    "checked": true,
    "disabled": true
  },
  {
    "tone": "neutral",
    "disabled": true
  },
  {
    "size": 32,
    "checked": true
  },
  {
    "size": 24,
    "checked": true
  },
  {
    "size": 16,
    "checked": true
  }
];

export const switchmarkVariantMap = {
  "tone": [
    "neutral",
    "brand"
  ],
  "size": [
    "16",
    "24",
    "32"
  ],
  "checked": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ]
};

export const switchmarkVariantKeys = Object.keys(switchmarkVariantMap);

export function switchmark(props) {
  return Object.fromEntries(
    switchmarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchmark, { splitVariantProps: (props) => splitVariantProps(props, switchmarkVariantMap) });

// @recipe(seed): switchmark