const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const dialogSlotNames = [
  [
    "positioner",
    "seed-dialog__positioner"
  ],
  [
    "backdrop",
    "seed-dialog__backdrop"
  ],
  [
    "content",
    "seed-dialog__content"
  ],
  [
    "header",
    "seed-dialog__header"
  ],
  [
    "footer",
    "seed-dialog__footer"
  ],
  [
    "action",
    "seed-dialog__action"
  ],
  [
    "title",
    "seed-dialog__title"
  ],
  [
    "description",
    "seed-dialog__description"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const dialogVariantMap = {};

const dialogVariantKeys = Object.keys(dialogVariantMap);

function dialog(props) {
  return Object.fromEntries(
    dialogSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(dialog, { splitVariantProps: (props) => splitVariantProps(props, dialogVariantMap) });

module.exports = dialog;
module.exports.dialogVariantMap = dialogVariantMap;
module.exports.dialogVariantKeys = dialogVariantKeys;