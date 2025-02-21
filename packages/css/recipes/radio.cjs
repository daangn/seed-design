const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const radioSlotNames = [
  [
    "root",
    "seed-radio__root"
  ],
  [
    "icon",
    "seed-radio__icon"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

const radioVariantMap = {
  "size": [
    "large",
    "medium"
  ]
};

const radioVariantKeys = Object.keys(radioVariantMap);

function radio(props) {
  return Object.fromEntries(
    radioSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radio, { splitVariantProps: (props) => splitVariantProps(props, radioVariantMap) });

module.exports = radio;
module.exports.radioVariantMap = radioVariantMap;
module.exports.radioVariantKeys = radioVariantKeys;