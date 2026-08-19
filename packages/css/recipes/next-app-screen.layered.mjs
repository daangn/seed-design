import './next-app-screen.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const nextAppScreenSlotNames = [
  [
    "root",
    "seed-next-app-screen__root"
  ],
  [
    "dim",
    "seed-next-app-screen__dim"
  ],
  [
    "layer",
    "seed-next-app-screen__layer"
  ],
  [
    "content",
    "seed-next-app-screen__content"
  ],
  [
    "edge",
    "seed-next-app-screen__edge"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "horizontalSlide",
  "contentOffsetTop": "appBar",
  "contentOffsetBottom": "none",
  "tone": "layer",
  "gradient": true
};

const compoundVariants = [];

export const nextAppScreenVariantMap = {
  "theme": [
    "cupertino",
    "android"
  ],
  "transitionStyle": [
    "horizontalSlide",
    "verticalSlide",
    "crossfade",
    "experimental_scaleSlide"
  ],
  "contentOffsetTop": [
    "none",
    "safeArea",
    "appBar"
  ],
  "contentOffsetBottom": [
    "none",
    "safeArea"
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

export const nextAppScreenVariantKeys = Object.keys(nextAppScreenVariantMap);

export function nextAppScreen(props) {
  return Object.fromEntries(
    nextAppScreenSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(nextAppScreen, { splitVariantProps: (props) => splitVariantProps(props, nextAppScreenVariantMap) });

// @recipe(seed): next-app-screen