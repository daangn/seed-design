const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const identityPlaceholderSlotNames = [
  [
    "root",
    "seed-identity-placeholder__root"
  ],
  [
    "image",
    "seed-identity-placeholder__image"
  ]
];

const defaultVariant = {
  "identity": "person"
};

const compoundVariants = [];

const identityPlaceholderVariantMap = {
  "identity": [
    "person"
  ]
};

const identityPlaceholderVariantKeys = Object.keys(identityPlaceholderVariantMap);

function identityPlaceholder(props) {
  return Object.fromEntries(
    identityPlaceholderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(identityPlaceholder, { splitVariantProps: (props) => splitVariantProps(props, identityPlaceholderVariantMap) });

module.exports = identityPlaceholder;
module.exports.identityPlaceholderVariantMap = identityPlaceholderVariantMap;
module.exports.identityPlaceholderVariantKeys = identityPlaceholderVariantKeys;