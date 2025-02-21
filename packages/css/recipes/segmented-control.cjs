const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const segmentedControlSlotNames = [
  [
    "root",
    "seed-segmented-control__root"
  ],
  [
    "indicator",
    "seed-segmented-control__indicator"
  ],
  [
    "item",
    "seed-segmented-control__item"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const segmentedControlVariantMap = {};

const segmentedControlVariantKeys = Object.keys(segmentedControlVariantMap);

function segmentedControl(props) {
  return Object.fromEntries(
    segmentedControlSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(segmentedControl, { splitVariantProps: (props) => splitVariantProps(props, segmentedControlVariantMap) });

module.exports = segmentedControl;
module.exports.segmentedControlVariantMap = segmentedControlVariantMap;
module.exports.segmentedControlVariantKeys = segmentedControlVariantKeys;