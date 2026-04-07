import './app-bar-main.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const appBarMainSlotNames = [
  [
    "root",
    "ride-app-bar-main__root"
  ],
  [
    "title",
    "ride-app-bar-main__title"
  ],
  [
    "subtitle",
    "ride-app-bar-main__subtitle"
  ]
];

const defaultVariant = {
  "layout": "titleOnly",
  "theme": "cupertino",
  "transitionStyle": "slideFromRightIOS",
  "tone": "layer"
};

const compoundVariants = [];

export const appBarMainVariantMap = {
  "layout": [
    "titleOnly",
    "withSubtitle"
  ],
  "theme": [
    "cupertino",
    "android"
  ],
  "transitionStyle": [
    "slideFromRightIOS",
    "fadeFromBottomAndroid",
    "fadeIn"
  ],
  "tone": [
    "layer",
    "transparent"
  ]
};

export const appBarMainVariantKeys = Object.keys(appBarMainVariantMap);

export function appBarMain(props) {
  return Object.fromEntries(
    appBarMainSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(appBarMain, { splitVariantProps: (props) => splitVariantProps(props, appBarMainVariantMap) });

// @recipe(seed): app-bar-main