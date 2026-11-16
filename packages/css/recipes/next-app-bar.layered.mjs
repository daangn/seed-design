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
    "row",
    "seed-next-app-bar__row"
  ],
  [
    "accessory",
    "seed-next-app-bar__accessory"
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
    "textButton",
    "seed-next-app-bar__textButton"
  ],
  [
    "textButtonLabel",
    "seed-next-app-bar__textButtonLabel"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "tone": "layer"
};

const compoundVariants = [];

export const nextAppBarVariantMap = {
  "theme": [
    "cupertino",
    "android"
  ],
  "tone": [
    "layer",
    "gradient"
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