const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

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

const appScreenVariantMap = {
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

const appScreenVariantKeys = Object.keys(appScreenVariantMap);

function appScreen(props) {
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

module.exports = appScreen;
module.exports.appScreenVariantMap = appScreenVariantMap;
module.exports.appScreenVariantKeys = appScreenVariantKeys;