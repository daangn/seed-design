const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const controlChipSlotNames = [
  [
    "root",
    "seed-control-chip__root"
  ]
];

const defaultVariant = {
  "size": "medium",
  "layout": "withText"
};

const compoundVariants = [
  {
    "size": "medium",
    "layout": "withText"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "small",
    "layout": "withText"
  },
  {
    "size": "small",
    "layout": "iconOnly"
  }
];

const controlChipVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ]
};

const controlChipVariantKeys = Object.keys(controlChipVariantMap);

function controlChip(props) {
  return Object.fromEntries(
    controlChipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(controlChip, { splitVariantProps: (props) => splitVariantProps(props, controlChipVariantMap) });

module.exports = controlChip;
module.exports.controlChipVariantMap = controlChipVariantMap;
module.exports.controlChipVariantKeys = controlChipVariantKeys;