import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const appScreenSlotNames = [
  [
    "root",
    "seed-app-screen__root"
  ],
  [
    "layer",
    "seed-app-screen__layer"
  ],
  [
    "dim",
    "seed-app-screen__dim"
  ],
  [
    "edge",
    "seed-app-screen__edge"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "slideFromRightIOS",
  "layerOffsetTop": "appBar",
  "layerOffsetBottom": "none"
};

const compoundVariants = [];

export const appScreenVariantMap = {
  "theme": [
    "cupertino",
    "android"
  ],
  "transitionStyle": [
    "slideFromRightIOS",
    "fadeFromBottomAndroid"
  ],
  "layerOffsetTop": [
    "none",
    "safeArea",
    "appBar"
  ],
  "layerOffsetBottom": [
    "none",
    "safeArea"
  ]
};

export const appScreenVariantKeys = Object.keys(appScreenVariantMap);

export function appScreen(props) {
  return Object.fromEntries(
    appScreenSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(appScreen, { splitVariantProps: (props) => splitVariantProps(props, appScreenVariantMap) });

// @recipe(seed): app-screen