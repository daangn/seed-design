const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const selectBoxGroupSlotNames = [
  [
    "root",
    "seed-select-box-group__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const selectBoxGroupVariantMap = {};

const selectBoxGroupVariantKeys = Object.keys(selectBoxGroupVariantMap);

function selectBoxGroup(props) {
  return Object.fromEntries(
    selectBoxGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBoxGroup, { splitVariantProps: (props) => splitVariantProps(props, selectBoxGroupVariantMap) });

module.exports = selectBoxGroup;
module.exports.selectBoxGroupVariantMap = selectBoxGroupVariantMap;
module.exports.selectBoxGroupVariantKeys = selectBoxGroupVariantKeys;