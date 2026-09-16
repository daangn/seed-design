import './scroll-fog.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const scrollFogSlotNames = [
  [
    "root",
    "seed-scroll-fog__root"
  ],
  [
    "topMask",
    "seed-scroll-fog__topMask"
  ],
  [
    "bottomMask",
    "seed-scroll-fog__bottomMask"
  ],
  [
    "leftMask",
    "seed-scroll-fog__leftMask"
  ],
  [
    "rightMask",
    "seed-scroll-fog__rightMask"
  ],
  [
    "verticalScroll",
    "seed-scroll-fog__verticalScroll"
  ],
  [
    "horizontalScroll",
    "seed-scroll-fog__horizontalScroll"
  ]
];

const defaultVariant = {
  "top": false,
  "bottom": false,
  "left": false,
  "right": false
};

const compoundVariants = [];

export const scrollFogVariantMap = {
  "top": [
    true,
    false
  ],
  "bottom": [
    true,
    false
  ],
  "left": [
    true,
    false
  ],
  "right": [
    true,
    false
  ]
};

export const scrollFogVariantKeys = Object.keys(scrollFogVariantMap);

export function scrollFog(props) {
  return Object.fromEntries(
    scrollFogSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(scrollFog, { splitVariantProps: (props) => splitVariantProps(props, scrollFogVariantMap) });

// @recipe(seed): scroll-fog