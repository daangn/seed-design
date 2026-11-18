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
    "variant": "solid",
    "selected": false,
    "disabled": false
  },
  {
    "variant": "outlineStrong",
    "pressed": true,
    "selected": false
  },
  {
    "variant": "outlineStrong",
    "selected": false,
    "disabled": false
  },
  {
    "variant": "outlineWeak",
    "pressed": true,
    "selected": false
  },
  {
    "variant": "outlineWeak",
    "selected": false,
    "disabled": false
  },
  {
    "variant": "solid",
    "selected": true,
    "pressed": true
  },
  {
    "variant": "solid",
    "selected": true,
    "disabled": false
  },
  {
    "variant": "outlineStrong",
    "selected": true,
    "pressed": true
  },
  {
    "variant": "outlineStrong",
    "selected": true,
    "disabled": false
  },
  {
    "variant": "outlineWeak",
    "selected": true,
    "pressed": true
  },
  {
    "variant": "outlineWeak",
    "selected": true,
    "disabled": false
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
  ],
  "glass": [
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

// Generated from Rootage component specs and color tokens by scripts/generate-glass-tint.mjs. Do not edit directly.
// Liquid Glass tint (`root.color`) per variant and state, resolved for each color scheme.
export const glassTint = {
  variantSolid: {
    enabled: { light: "#14273b0d", dark: "#c8ddff25" },
    pressed: { light: "#000f2d11", dark: "#cfddff35" },
    selected: { light: "#2a3038", dark: "#f3f4f5" },
    selectedPressed: { light: "#555d6d", dark: "#dcdee3" },
  },
  variantOutlineStrong: {
    enabled: { light: "#00000000", dark: "#ffffff00" },
    pressed: { light: "#00000007", dark: "#ffffff0d" },
    selected: { light: "#2a3038", dark: "#f3f4f5" },
    selectedPressed: { light: "#555d6d", dark: "#dcdee3" },
  },
  variantOutlineWeak: {
    enabled: { light: "#00000000", dark: "#ffffff00" },
    pressed: { light: "#00000007", dark: "#ffffff0d" },
    selected: { light: "#f3f4f5", dark: "#2b2e35" },
    selectedPressed: { light: "#eeeff1", dark: "#393d46" },
  },
};
