const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const helpBubbleSlotNames = [
  [
    "positioner",
    "seed-help-bubble__positioner"
  ],
  [
    "backdrop",
    "seed-help-bubble__backdrop"
  ],
  [
    "content",
    "seed-help-bubble__content"
  ],
  [
    "arrow",
    "seed-help-bubble__arrow"
  ],
  [
    "title",
    "seed-help-bubble__title"
  ],
  [
    "description",
    "seed-help-bubble__description"
  ],
  [
    "closeButton",
    "seed-help-bubble__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const helpBubbleVariantMap = {};

const helpBubbleVariantKeys = Object.keys(helpBubbleVariantMap);

function helpBubble(props) {
  return Object.fromEntries(
    helpBubbleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(helpBubble, { splitVariantProps: (props) => splitVariantProps(props, helpBubbleVariantMap) });

module.exports = helpBubble;
module.exports.helpBubbleVariantMap = helpBubbleVariantMap;
module.exports.helpBubbleVariantKeys = helpBubbleVariantKeys;