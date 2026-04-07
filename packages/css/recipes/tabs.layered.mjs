import './tabs.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const tabsSlotNames = [
  [
    "root",
    "ride-tabs__root"
  ],
  [
    "list",
    "ride-tabs__list"
  ],
  [
    "carousel",
    "ride-tabs__carousel"
  ],
  [
    "carouselCamera",
    "ride-tabs__carouselCamera"
  ],
  [
    "content",
    "ride-tabs__content"
  ],
  [
    "indicator",
    "ride-tabs__indicator"
  ],
  [
    "trigger",
    "ride-tabs__trigger"
  ]
];

const defaultVariant = {
  "triggerLayout": "fill",
  "contentLayout": "hug",
  "size": "small",
  "stickyList": false
};

const compoundVariants = [];

export const tabsVariantMap = {
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

export const tabsVariantKeys = Object.keys(tabsVariantMap);

export function tabs(props) {
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

// @recipe(seed): tabs