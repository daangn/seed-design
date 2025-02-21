const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const linkContentSlotNames = [
  [
    "root",
    "seed-link-content__root"
  ]
];

const defaultVariant = {
  "size": "t4"
};

const compoundVariants = [];

const linkContentVariantMap = {
  "weight": [
    "bold",
    "regular"
  ],
  "size": [
    "t6",
    "t5",
    "t4"
  ]
};

const linkContentVariantKeys = Object.keys(linkContentVariantMap);

function linkContent(props) {
  return Object.fromEntries(
    linkContentSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(linkContent, { splitVariantProps: (props) => splitVariantProps(props, linkContentVariantMap) });

module.exports = linkContent;
module.exports.linkContentVariantMap = linkContentVariantMap;
module.exports.linkContentVariantKeys = linkContentVariantKeys;