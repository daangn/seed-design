const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

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

const appBarMainVariantMap = {
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
    "fadeFromBottomAndroid"
  ],
  "tone": [
    "layer",
    "transparent"
  ]
};

const appBarMainVariantKeys = Object.keys(appBarMainVariantMap);

function appBarMain(props) {
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

module.exports = appBarMain;
module.exports.appBarMainVariantMap = appBarMainVariantMap;
module.exports.appBarMainVariantKeys = appBarMainVariantKeys;