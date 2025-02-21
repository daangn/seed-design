const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const snackbarSlotNames = [
  [
    "root",
    "seed-snackbar__root"
  ],
  [
    "message",
    "seed-snackbar__message"
  ],
  [
    "prefixIcon",
    "seed-snackbar__prefixIcon"
  ],
  [
    "actionButton",
    "seed-snackbar__actionButton"
  ]
];

const defaultVariant = {
  "variant": "default"
};

const compoundVariants = [];

const snackbarVariantMap = {
  "variant": [
    "default",
    "positive",
    "critical"
  ]
};

const snackbarVariantKeys = Object.keys(snackbarVariantMap);

function snackbar(props) {
  return Object.fromEntries(
    snackbarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(snackbar, { splitVariantProps: (props) => splitVariantProps(props, snackbarVariantMap) });

module.exports = snackbar;
module.exports.snackbarVariantMap = snackbarVariantMap;
module.exports.snackbarVariantKeys = snackbarVariantKeys;