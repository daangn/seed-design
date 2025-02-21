const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const tabsSlotNames = [
  [
    "root",
    "seed-tabs__root"
  ],
  [
    "list",
    "seed-tabs__list"
  ],
  [
    "carousel",
    "seed-tabs__carousel"
  ],
  [
    "carouselCamera",
    "seed-tabs__carouselCamera"
  ],
  [
    "content",
    "seed-tabs__content"
  ],
  [
    "indicator",
    "seed-tabs__indicator"
  ],
  [
    "trigger",
    "seed-tabs__trigger"
  ],
  [
    "triggerNotification",
    "seed-tabs__triggerNotification"
  ]
];

const defaultVariant = {
  "triggerLayout": "fill",
  "contentLayout": "hug",
  "size": "small",
  "stickyList": false
};

const compoundVariants = [];

const tabsVariantMap = {
  "triggerLayout": [
    "fill",
    "hug"
  ],
  "contentLayout": [
    "fill",
    "hug"
  ],
  "size": [
    "small",
    "medium"
  ],
  "stickyList": [
    true,
    false
  ]
};

const tabsVariantKeys = Object.keys(tabsVariantMap);

function tabs(props) {
  return Object.fromEntries(
    tabsSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(tabs, { splitVariantProps: (props) => splitVariantProps(props, tabsVariantMap) });

module.exports = tabs;
module.exports.tabsVariantMap = tabsVariantMap;
module.exports.tabsVariantKeys = tabsVariantKeys;