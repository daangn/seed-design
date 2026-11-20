import './app-bar.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const appBarSlotNames = [
  [
    "root",
    "seed-app-bar__root"
  ],
  [
    "background",
    "seed-app-bar__background"
  ],
  [
    "left",
    "seed-app-bar__left"
  ],
  [
    "right",
    "seed-app-bar__right"
  ],
  [
    "iconButton",
    "seed-app-bar__iconButton"
  ],
  [
    "icon",
    "seed-app-bar__icon"
  ],
  [
    "textButton",
    "seed-app-bar__textButton"
  ],
  [
    "textButtonLabel",
    "seed-app-bar__textButtonLabel"
  ],
  [
    "custom",
    "seed-app-bar__custom"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "slideFromRightIOS",
  "tone": "layer"
};

const compoundVariants = [];

export const appBarVariantMap = {
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

export const appBarVariantKeys = Object.keys(appBarVariantMap);

export function appBar(props) {
  return Object.fromEntries(
    appBarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(appBar, { splitVariantProps: (props) => splitVariantProps(props, appBarVariantMap) });

// @recipe(seed): app-bar

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const appBarSeedTagSpec = {
  name: "TopNavigation",
  axes: ["theme", "tone", "gradient", "titleLayout"],
  defaults: { theme: "cupertino", tone: "layer" },
};
