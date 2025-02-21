const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const selectBoxSlotNames = [
  [
    "root",
    "seed-select-box__root"
  ],
  [
    "content",
    "seed-select-box__content"
  ],
  [
    "label",
    "seed-select-box__label"
  ],
  [
    "description",
    "seed-select-box__description"
  ],
  [
    "checkboxControl",
    "seed-select-box__checkboxControl"
  ],
  [
    "checkboxIcon",
    "seed-select-box__checkboxIcon"
  ],
  [
    "radioControl",
    "seed-select-box__radioControl"
  ],
  [
    "radioIcon",
    "seed-select-box__radioIcon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

const selectBoxVariantMap = {};

const selectBoxVariantKeys = Object.keys(selectBoxVariantMap);

function selectBox(props) {
  return Object.fromEntries(
    selectBoxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBox, { splitVariantProps: (props) => splitVariantProps(props, selectBoxVariantMap) });

module.exports = selectBox;
module.exports.selectBoxVariantMap = selectBoxVariantMap;
module.exports.selectBoxVariantKeys = selectBoxVariantKeys;