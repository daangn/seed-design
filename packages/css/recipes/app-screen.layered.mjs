import './app-screen.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const appScreenSlotNames = [
  [
    "root",
    "ride-app-screen__root"
  ],
  [
    "layer",
    "ride-app-screen__layer"
  ],
  [
    "dim",
    "ride-app-screen__dim"
  ],
  [
    "edge",
    "ride-app-screen__edge"
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "slideFromRightIOS",
  "layerOffsetTop": "appBar",
  "layerOffsetBottom": "none",
  "tone": "layer",
  "gradient": true
};

const compoundVariants = [
  {
    "tone": "transparent",
    "gradient": true
  },
  {
    "tone": "transparent",
    "gradient": true,
    "layerOffsetBottom": "none"
  },
  {
    "tone": "transparent",
    "gradient": true,
    "layerOffsetTop": "safeArea"
  },
  {
    "tone": "transparent",
    "gradient": true,
    "layerOffsetTop": "appBar"
  }
];

export const appScreenVariantMap = {
  "theme": [
    "cupertino",
    "android"
  ],
  "transitionStyle": [
    "slideFromRightIOS",
    "fadeFromBottomAndroid",
    "fadeIn"
  ],
  "layerOffsetTop": [
    "none",
    "safeArea",
    "appBar"
  ],
  "layerOffsetBottom": [
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