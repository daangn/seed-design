const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const skeletonSlotNames = [
  [
    "root",
    "seed-skeleton__root"
  ]
];

const defaultVariant = {
  "radius": 8
};

const compoundVariants = [];

const skeletonVariantMap = {
  "radius": [
    "0",
    "8",
    "16",
    "full"
  ]
};

const skeletonVariantKeys = Object.keys(skeletonVariantMap);

function skeleton(props) {
  return Object.fromEntries(
    skeletonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(skeleton, { splitVariantProps: (props) => splitVariantProps(props, skeletonVariantMap) });

module.exports = skeleton;
module.exports.skeletonVariantMap = skeletonVariantMap;
module.exports.skeletonVariantKeys = skeletonVariantKeys;