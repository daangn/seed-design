import './chip-tabs.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const chipTabsSlotNames = [
  [
    "root",
    "ride-chip-tabs__root"
  ],
  [
    "list",
    "ride-chip-tabs__list"
  ],
  [
    "carousel",
    "ride-chip-tabs__carousel"
  ],
  [
    "carouselCamera",
    "ride-chip-tabs__carouselCamera"
  ],
  [
    "content",
    "ride-chip-tabs__content"
  ],
  [
    "trigger",
    "ride-chip-tabs__trigger"
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
    "neutralOutline",
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

export const chipTabsVariantKeys = Object.keys(chipTabsVariantMap);

export function chipTabs(props) {
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

// @recipe(seed): chip-tabs