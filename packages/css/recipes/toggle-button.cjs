const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const toggleButtonSlotNames = [
  [
    "root",
    "seed-toggle-button__root"
  ]
];

const defaultVariant = {
  "variant": "brandSolid",
  "size": "small"
};

const compoundVariants = [];

const toggleButtonVariantMap = {
  "variant": [
    "brandSolid",
    "neutralWeak"
  ],
  "size": [
    "xsmall",
    "small"
  ]
};

const toggleButtonVariantKeys = Object.keys(toggleButtonVariantMap);

function toggleButton(props) {
  return Object.fromEntries(
    toggleButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(toggleButton, { splitVariantProps: (props) => splitVariantProps(props, toggleButtonVariantMap) });

module.exports = toggleButton;
module.exports.toggleButtonVariantMap = toggleButtonVariantMap;
module.exports.toggleButtonVariantKeys = toggleButtonVariantKeys;