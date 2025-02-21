const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const extendedActionSheetSlotNames = [
  [
    "backdrop",
    "seed-extended-action-sheet__backdrop"
  ],
  [
    "positioner",
    "seed-extended-action-sheet__positioner"
  ],
  [
    "content",
    "seed-extended-action-sheet__content"
  ],
  [
    "header",
    "seed-extended-action-sheet__header"
  ],
  [
    "title",
    "seed-extended-action-sheet__title"
  ],
  [
    "list",
    "seed-extended-action-sheet__list"
  ],
  [
    "group",
    "seed-extended-action-sheet__group"
  ],
  [
    "footer",
    "seed-extended-action-sheet__footer"
  ],
  [
    "closeButton",
    "seed-extended-action-sheet__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const extendedActionSheetVariantMap = {};

const extendedActionSheetVariantKeys = Object.keys(extendedActionSheetVariantMap);

function extendedActionSheet(props) {
  return Object.fromEntries(
    extendedActionSheetSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(extendedActionSheet, { splitVariantProps: (props) => splitVariantProps(props, extendedActionSheetVariantMap) });

module.exports = extendedActionSheet;
module.exports.extendedActionSheetVariantMap = extendedActionSheetVariantMap;
module.exports.extendedActionSheetVariantKeys = extendedActionSheetVariantKeys;