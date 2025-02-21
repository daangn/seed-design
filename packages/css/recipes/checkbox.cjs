const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const checkboxSlotNames = [
  [
    "root",
    "seed-checkbox__root"
  ],
  [
    "control",
    "seed-checkbox__control"
  ],
  [
    "icon",
    "seed-checkbox__icon"
  ],
  [
    "label",
    "seed-checkbox__label"
  ]
];

const defaultVariant = {
  "size": "medium",
  "variant": "square",
  "weight": "default"
};

const compoundVariants = [
  {
    "size": "medium",
    "variant": "ghost"
  },
  {
    "size": "large",
    "variant": "ghost"
  },
  {
    "size": "medium",
    "variant": "square"
  },
  {
    "size": "large",
    "variant": "square"
  }
];

const checkboxVariantMap = {
  "weight": [
    "default",
    "stronger"
  ],
  "variant": [
    "square",
    "ghost"
  ],
  "size": [
    "large",
    "medium"
  ]
};

const checkboxVariantKeys = Object.keys(checkboxVariantMap);

function checkbox(props) {
  return Object.fromEntries(
    checkboxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkbox, { splitVariantProps: (props) => splitVariantProps(props, checkboxVariantMap) });

module.exports = checkbox;
module.exports.checkboxVariantMap = checkboxVariantMap;
module.exports.checkboxVariantKeys = checkboxVariantKeys;