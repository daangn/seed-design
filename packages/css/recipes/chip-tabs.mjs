import './chip-tabs.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  "size": "medium",
  "variant": "neutralSolid",
  "contentLayout": "hug",
  "stickyList": false
};

const compoundVariants = [];

export const chipTabsVariantMap = {
  "size": [
    "medium",
    "large"
  ],
  "variant": [
    "neutralSolid",
    "neutralOutline"
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

export const chipTabsVariantKeys = Object.keys(chipTabsVariantMap);

export function chipTabs(props) {
  return createSlots(chipTabsSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(chipTabs, { splitVariantProps: (props) => splitVariantProps(props, chipTabsVariantMap) });

// @recipe(seed): chip-tabs