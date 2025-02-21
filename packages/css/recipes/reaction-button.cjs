const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const reactionButtonSlotNames = [
  [
    "root",
    "seed-reaction-button__root"
  ]
];

const defaultVariant = {
  "size": "small"
};

const compoundVariants = [];

const reactionButtonVariantMap = {
  "size": [
    "xsmall",
    "small"
  ]
};

const reactionButtonVariantKeys = Object.keys(reactionButtonVariantMap);

function reactionButton(props) {
  return Object.fromEntries(
    reactionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(reactionButton, { splitVariantProps: (props) => splitVariantProps(props, reactionButtonVariantMap) });

module.exports = reactionButton;
module.exports.reactionButtonVariantMap = reactionButtonVariantMap;
module.exports.reactionButtonVariantKeys = reactionButtonVariantKeys;