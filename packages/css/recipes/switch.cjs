const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const switchSlotNames = [
  [
    "root",
    "seed-switch__root"
  ],
  [
    "control",
    "seed-switch__control"
  ],
  [
    "thumb",
    "seed-switch__thumb"
  ],
  [
    "label",
    "seed-switch__label"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

const switchVariantMap = {
  "size": [
    "medium",
    "small"
  ]
};

const switchVariantKeys = Object.keys(switchVariantMap);

function switchStyle(props) {
  return Object.fromEntries(
    switchSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(switchStyle, { splitVariantProps: (props) => splitVariantProps(props, switchVariantMap) });

module.exports = switchStyle;
module.exports.switchVariantMap = switchVariantMap;
module.exports.switchVariantKeys = switchVariantKeys;