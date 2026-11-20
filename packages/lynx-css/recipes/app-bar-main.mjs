import './app-bar-main.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const appBarMainSlotNames = [
  [
    "root",
    "seed-app-bar-main__root"
  ],
  [
    "title",
    "seed-app-bar-main__title"
  ],
  [
    "subtitle",
    "seed-app-bar-main__subtitle"
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const appBarMainSeedTagSpec = {
  name: "AppBarMain",
  axes: [],
  defaults: {},
};
