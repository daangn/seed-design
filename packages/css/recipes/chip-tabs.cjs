const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const chipTabsSlotNames = [
  [
    "root",
    "seed-chip-tabs__root"
  ],
  [
    "list",
    "seed-chip-tabs__list"
  ],
  [
    "carousel",
    "seed-chip-tabs__carousel"
  ],
  [
    "carouselCamera",
    "seed-chip-tabs__carouselCamera"
  ],
  [
    "content",
    "seed-chip-tabs__content"
  ],
  [
    "trigger",
    "seed-chip-tabs__trigger"
  ]
];

const defaultVariant = {
  "variant": "neutralSolid",
  "contentLayout": "hug",
  "stickyList": false
};

const compoundVariants = [];

const chipTabsVariantMap = {
  "variant": [
    "neutralSolid",
    "brandSolid"
  ],
  "contentLayout": [
    "fill",
    "hug"
  ],
  "stickyList": [
    true,
    false
  ]
};

const chipTabsVariantKeys = Object.keys(chipTabsVariantMap);

function chipTabs(props) {
  return Object.fromEntries(
    chipTabsSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(chipTabs, { splitVariantProps: (props) => splitVariantProps(props, chipTabsVariantMap) });

module.exports = chipTabs;
module.exports.chipTabsVariantMap = chipTabsVariantMap;
module.exports.chipTabsVariantKeys = chipTabsVariantKeys;