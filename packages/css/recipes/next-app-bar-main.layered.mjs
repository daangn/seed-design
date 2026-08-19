import './next-app-bar-main.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const nextAppBarMainSlotNames = [
  [
    "root",
    "seed-next-app-bar-main__root"
  ],
  [
    "title",
    "seed-next-app-bar-main__title"
  ],
  [
    "subtitle",
    "seed-next-app-bar-main__subtitle"
  ]
];

const defaultVariant = {
  "layout": "titleOnly",
  "theme": "cupertino",
  "transitionStyle": "horizontalSlide",
  "tone": "layer"
};

const compoundVariants = [];

export const nextAppBarMainVariantMap = {
  "layout": [
    "titleOnly",
    "withSubtitle"
  ],
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
  "tone": [
    "layer",
    "transparent"
  ]
};

export const nextAppBarMainVariantKeys = Object.keys(nextAppBarMainVariantMap);

export function nextAppBarMain(props) {
  return Object.fromEntries(
    nextAppBarMainSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(nextAppBarMain, { splitVariantProps: (props) => splitVariantProps(props, nextAppBarMainVariantMap) });

// @recipe(seed): next-app-bar-main