const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const mannerTempBadgeSlotNames = [
  [
    "root",
    "seed-manner-temp-badge__root"
  ]
];

const defaultVariant = {
  "level": "l1"
};

const compoundVariants = [];

const mannerTempBadgeVariantMap = {
  "level": [
    "l1",
    "l2",
    "l3",
    "l4",
    "l5",
    "l6"
  ]
};

const mannerTempBadgeVariantKeys = Object.keys(mannerTempBadgeVariantMap);

function mannerTempBadge(props) {
  return Object.fromEntries(
    mannerTempBadgeSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(mannerTempBadge, { splitVariantProps: (props) => splitVariantProps(props, mannerTempBadgeVariantMap) });

module.exports = mannerTempBadge;
module.exports.mannerTempBadgeVariantMap = mannerTempBadgeVariantMap;
module.exports.mannerTempBadgeVariantKeys = mannerTempBadgeVariantKeys;