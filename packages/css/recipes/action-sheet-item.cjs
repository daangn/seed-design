const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const actionSheetItemSlotNames = [
  [
    "root",
    "seed-action-sheet-item__root"
  ]
];

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

const actionSheetItemVariantMap = {
  "tone": [
    "neutral",
    "critical"
  ]
};

const actionSheetItemVariantKeys = Object.keys(actionSheetItemVariantMap);

function actionSheetItem(props) {
  return Object.fromEntries(
    actionSheetItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(actionSheetItem, { splitVariantProps: (props) => splitVariantProps(props, actionSheetItemVariantMap) });

module.exports = actionSheetItem;
module.exports.actionSheetItemVariantMap = actionSheetItemVariantMap;
module.exports.actionSheetItemVariantKeys = actionSheetItemVariantKeys;