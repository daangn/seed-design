const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const avatarStackSlotNames = [
  [
    "root",
    "seed-avatar-stack__root"
  ],
  [
    "item",
    "seed-avatar-stack__item"
  ]
];

const defaultVariant = {
  "size": 48
};

const compoundVariants = [];

const avatarStackVariantMap = {
  "size": [
    "20",
    "24",
    "36",
    "48",
    "64"
  ]
};

const avatarStackVariantKeys = Object.keys(avatarStackVariantMap);

function avatarStack(props) {
  return Object.fromEntries(
    avatarStackSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(avatarStack, { splitVariantProps: (props) => splitVariantProps(props, avatarStackVariantMap) });

module.exports = avatarStack;
module.exports.avatarStackVariantMap = avatarStackVariantMap;
module.exports.avatarStackVariantKeys = avatarStackVariantKeys;