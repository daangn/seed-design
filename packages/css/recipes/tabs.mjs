import './tabs.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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