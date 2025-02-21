const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const calloutSlotNames = [
  [
    "root",
    "seed-callout__root"
  ],
  [
    "content",
    "seed-callout__content"
  ],
  [
    "title",
    "seed-callout__title"
  ],
  [
    "description",
    "seed-callout__description"
  ],
  [
    "link",
    "seed-callout__link"
  ],
  [
    "closeButton",
    "seed-callout__closeButton"
  ]
];

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

const calloutVariantMap = {
  "tone": [
    "neutral",
    "informative",
    "warning",
    "critical",
    "magic"
  ]
};

const calloutVariantKeys = Object.keys(calloutVariantMap);

function callout(props) {
  return Object.fromEntries(
    calloutSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(callout, { splitVariantProps: (props) => splitVariantProps(props, calloutVariantMap) });

module.exports = callout;
module.exports.calloutVariantMap = calloutVariantMap;
module.exports.calloutVariantKeys = calloutVariantKeys;