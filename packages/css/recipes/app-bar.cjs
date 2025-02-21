const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const appBarSlotNames = [
  [
    "root",
    "seed-app-bar__root"
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
  ]
];

const defaultVariant = {
  "theme": "cupertino",
  "transitionStyle": "slideFromRightIOS",
  "tone": "layer",
  "divider": false
};

const compoundVariants = [];

const appBarVariantMap = {
  "theme": [
    "cupertino",
    "android"
  ],
  "transitionStyle": [
    "slideFromRightIOS",
    "fadeFromBottomAndroid"
  ],
  "tone": [
    "layer",
    "transparent"
  ],
  "divider": [
    true
  ]
};

const appBarVariantKeys = Object.keys(appBarVariantMap);

function appBar(props) {
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

module.exports = appBar;
module.exports.appBarVariantMap = appBarVariantMap;
module.exports.appBarVariantKeys = appBarVariantKeys;