const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const textSlotNames = [
  [
    "root",
    "seed-text__root"
  ]
];

const defaultVariant = {
  "textStyle": "t5Regular",
  "maxLines": "none"
};

const compoundVariants = [];

const textVariantMap = {
  "textStyle": [
    "screenTitle",
    "articleBody",
    "t1Regular",
    "t1Medium",
    "t1Bold",
    "t2Regular",
    "t2Medium",
    "t2Bold",
    "t3Regular",
    "t3Medium",
    "t3Bold",
    "t4Regular",
    "t4Medium",
    "t4Bold",
    "t5Regular",
    "t5Medium",
    "t5Bold",
    "t6Bold",
    "t7Bold",
    "t8Bold",
    "t9Bold",
    "t10Bold"
  ],
  "maxLines": [
    "none",
    "single",
    "multi"
  ]
};

const textVariantKeys = Object.keys(textVariantMap);

function text(props) {
  return Object.fromEntries(
    textSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(text, { splitVariantProps: (props) => splitVariantProps(props, textVariantMap) });

module.exports = text;
module.exports.textVariantMap = textVariantMap;
module.exports.textVariantKeys = textVariantKeys;