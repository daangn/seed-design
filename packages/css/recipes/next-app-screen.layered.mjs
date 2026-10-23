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
  "transitionStyle": "horizontalSlide",
  "contentOffsetTop": "appBar",
  "contentOffsetBottom": "safeArea"
};

const compoundVariants = [];

export const nextAppScreenVariantMap = {
  "transitionStyle": [
    "horizontalSlide",
    "verticalSlide",
    "crossfade"
  ],
  "contentOffsetTop": [
    "none",
    "safeArea",
    "appBar"
  ],
  "contentOffsetBottom": [
    "none",
    "safeArea"
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