const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const extendedFabSlotNames = [
  [
    "root",
    "seed-extended-fab__root"
  ]
];

const defaultVariant = {
  "variant": "neutralSolid",
  "size": "medium"
};

const compoundVariants = [];

const extendedFabVariantMap = {
  "variant": [
    "neutralSolid",
    "layerFloating"
  ],
  "size": [
    "small",
    "medium"
  ]
};

const extendedFabVariantKeys = Object.keys(extendedFabVariantMap);

function extendedFab(props) {
  return Object.fromEntries(
    extendedFabSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(extendedFab, { splitVariantProps: (props) => splitVariantProps(props, extendedFabVariantMap) });

module.exports = extendedFab;
module.exports.extendedFabVariantMap = extendedFabVariantMap;
module.exports.extendedFabVariantKeys = extendedFabVariantKeys;