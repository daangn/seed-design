import './app-bar.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const appBarSlotNames = [
  [
    "root",
    "ride-app-bar__root"
  ],
  [
    "left",
    "ride-app-bar__left"
  ],
  [
    "right",
    "ride-app-bar__right"
  ],
  [
    "iconButton",
    "ride-app-bar__iconButton"
  ],
  [
    "icon",
    "ride-app-bar__icon"
  ],
  [
    "custom",
    "ride-app-bar__custom"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "slideFromRightIOS",
  "tone": "layer",
  "divider": false
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
  ],
  "divider": [
    true
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