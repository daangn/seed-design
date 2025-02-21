const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const visuallyHiddenSlotNames = [
  [
    "root",
    "seed-visually-hidden__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const visuallyHiddenVariantMap = {};

const visuallyHiddenVariantKeys = Object.keys(visuallyHiddenVariantMap);

function visuallyHidden(props) {
  return Object.fromEntries(
    visuallyHiddenSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(visuallyHidden, { splitVariantProps: (props) => splitVariantProps(props, visuallyHiddenVariantMap) });

module.exports = visuallyHidden;
module.exports.visuallyHiddenVariantMap = visuallyHiddenVariantMap;
module.exports.visuallyHiddenVariantKeys = visuallyHiddenVariantKeys;