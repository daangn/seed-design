const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const fabSlotNames = [
  [
    "root",
    "seed-fab__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const fabVariantMap = {};

const fabVariantKeys = Object.keys(fabVariantMap);

function fab(props) {
  return Object.fromEntries(
    fabSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fab, { splitVariantProps: (props) => splitVariantProps(props, fabVariantMap) });

module.exports = fab;
module.exports.fabVariantMap = fabVariantMap;
module.exports.fabVariantKeys = fabVariantKeys;