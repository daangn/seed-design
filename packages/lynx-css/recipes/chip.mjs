import './chip.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const chipSlotNames = [
  [
    "root",
    "seed-chip__root"
  ],
  [
    "label",
    "seed-chip__label"
  ],
  [
    "prefixIcon",
    "seed-chip__prefixIcon"
  ],
  [
    "prefixAvatar",
    "seed-chip__prefixAvatar"
  ],
  [
    "suffixIcon",
    "seed-chip__suffixIcon"
  ],
  [
    "icon",
    "seed-chip__icon"
  ]
];

const defaultVariant = {
  "variant": "solid",
  "size": "medium",
  "layout": "withText",
  "selected": false,
  "pressed": false,
  "disabled": false
};

const compoundVariants = [
  {
    "size": "small",
    "layout": "withText"
  },
  {
    "size": "medium",
    "layout": "withText"
  },
  {
    "size": "large",
    "layout": "withText"
  },
  {
    "size": "small",
    "layout": "iconOnly"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "large",
    "layout": "iconOnly"
  },
  {
    "variant": "solid",
    "selected": true
  },
  {
    "variant": "outlineStrong",
    "selected": true
  },
  {
    "variant": "outlineWeak",
    "selected": true
  },
  {
    "variant": "solid",
    "pressed": true,
    "selected": false
  },
  {
    "variant": "outlineStrong",
    "pressed": true,
    "selected": false
  },
  {
    "variant": "outlineWeak",
    "pressed": true,
    "selected": false
  },
  {
    "variant": "solid",
    "selected": true,
    "pressed": true
  },
  {
    "variant": "outlineStrong",
    "selected": true,
    "pressed": true
  },
  {
    "variant": "outlineWeak",
    "selected": true,
    "pressed": true
  }
];

export const chipVariantMap = {
  "variant": [
    "solid",
    "outlineStrong",
    "outlineWeak"
  ],
  "size": [
    "small",
    "medium",
    "large"
  ],
  "layout": [
    "iconOnly",
    "withText"
  ],
  "selected": [
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

export const chipVariantKeys = Object.keys(chipVariantMap);

export function chip(props) {
  return Object.fromEntries(
    chipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(chip, { splitVariantProps: (props) => splitVariantProps(props, chipVariantMap) });

// @recipe(seed): chip