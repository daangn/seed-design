import './next-app-bar.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const nextAppBarSlotNames = [
  [
    "root",
    "seed-next-app-bar__root"
  ],
  [
    "background",
    "seed-next-app-bar__background"
  ],
  [
    "left",
    "seed-next-app-bar__left"
  ],
  [
    "right",
    "seed-next-app-bar__right"
  ],
  [
    "iconButton",
    "seed-next-app-bar__iconButton"
  ],
  [
    "icon",
    "seed-next-app-bar__icon"
  ],
  [
    "custom",
    "seed-next-app-bar__custom"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "horizontalSlide",
  "tone": "layer",
  "gradient": true
};

const compoundVariants = [
  {
    "tone": "transparent",
    "gradient": true
  }
];

export const nextAppBarVariantMap = {
  "theme": [
    "cupertino",
    "android"
  ],
  "transitionStyle": [
    "horizontalSlide",
    "verticalSlide",
    "crossfade"
  ],
  "tone": [
    "layer",
    "transparent"
  ],
  "gradient": [
    true,
    false
  ]
};

export const nextAppBarVariantKeys = Object.keys(nextAppBarVariantMap);

export function nextAppBar(props) {
  return Object.fromEntries(
    nextAppBarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(nextAppBar, { splitVariantProps: (props) => splitVariantProps(props, nextAppBarVariantMap) });

// @recipe(seed): next-app-bar