import './scroll-fog.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const scrollFogSlotNames = [
  [
    "root",
    "seed-scroll-fog"
  ],
  [
    "text",
    "seed-scroll-fog__text"
  ]
];

const defaultVariant = {
  "hideScrollBar": false
};

const compoundVariants = [];

export const scrollFogVariantMap = {
  "hideScrollBar": [
    true
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