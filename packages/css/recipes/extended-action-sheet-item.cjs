const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const extendedActionSheetItemSlotNames = [
  [
    "root",
    "seed-extended-action-sheet-item__root"
  ]
];

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

const extendedActionSheetItemVariantMap = {
  "tone": [
    "neutral",
    "critical"
  ]
};

const extendedActionSheetItemVariantKeys = Object.keys(extendedActionSheetItemVariantMap);

function extendedActionSheetItem(props) {
  return Object.fromEntries(
    extendedActionSheetItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(extendedActionSheetItem, { splitVariantProps: (props) => splitVariantProps(props, extendedActionSheetItemVariantMap) });

module.exports = extendedActionSheetItem;
module.exports.extendedActionSheetItemVariantMap = extendedActionSheetItemVariantMap;
module.exports.extendedActionSheetItemVariantKeys = extendedActionSheetItemVariantKeys;