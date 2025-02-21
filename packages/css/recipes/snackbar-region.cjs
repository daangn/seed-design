const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const snackbarRegionSlotNames = [
  [
    "root",
    "seed-snackbar-region__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const snackbarRegionVariantMap = {};

const snackbarRegionVariantKeys = Object.keys(snackbarRegionVariantMap);

function snackbarRegion(props) {
  return Object.fromEntries(
    snackbarRegionSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(snackbarRegion, { splitVariantProps: (props) => splitVariantProps(props, snackbarRegionVariantMap) });

module.exports = snackbarRegion;
module.exports.snackbarRegionVariantMap = snackbarRegionVariantMap;
module.exports.snackbarRegionVariantKeys = snackbarRegionVariantKeys;