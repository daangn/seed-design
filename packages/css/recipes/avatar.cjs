const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const avatarSlotNames = [
  [
    "root",
    "seed-avatar__root"
  ],
  [
    "image",
    "seed-avatar__image"
  ],
  [
    "fallback",
    "seed-avatar__fallback"
  ],
  [
    "badge",
    "seed-avatar__badge"
  ]
];

const defaultVariant = {
  "size": 48
};

const compoundVariants = [];

const avatarVariantMap = {
  "size": [
    "20",
    "24",
    "36",
    "48",
    "64",
    "80",
    "96"
  ]
};

const avatarVariantKeys = Object.keys(avatarVariantMap);

function avatar(props) {
  return Object.fromEntries(
    avatarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(avatar, { splitVariantProps: (props) => splitVariantProps(props, avatarVariantMap) });

module.exports = avatar;
module.exports.avatarVariantMap = avatarVariantMap;
module.exports.avatarVariantKeys = avatarVariantKeys;