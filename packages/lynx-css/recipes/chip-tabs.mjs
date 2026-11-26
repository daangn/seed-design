import './chip-tabs.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
    "listContent",
    "seed-chip-tabs__listContent"
  ],
  [
    "trigger",
    "seed-chip-tabs__trigger"
  ],
  [
    "triggerLabel",
    "seed-chip-tabs__triggerLabel"
  ],
  [
    "content",
    "seed-chip-tabs__content"
  ],
  [
    "carousel",
    "seed-chip-tabs__carousel"
  ],
  [
    "carouselCamera",
    "seed-chip-tabs__carouselCamera"
  ]
];

const defaultVariant = {
  "extendSafeAreaX": false,
  "size": "medium",
  "variant": "neutralSolid",
  "contentLayout": "hug",
  "stickyList": false,
  "selected": false,
  "pressed": false,
  "disabled": false,
  "inCarousel": false
};

const compoundVariants = [
  {
    "variant": "neutralSolid",
    "selected": false,
    "disabled": false
  },
  {
    "variant": "neutralSolid",
    "selected": true,
    "disabled": false
  },
  {
    "variant": "neutralOutline",
    "selected": false,
    "disabled": false
  },
  {
    "variant": "neutralOutline",
    "selected": true,
    "disabled": false
  },
  {
    "variant": "neutralSolid",
    "selected": true
  },
  {
    "variant": "neutralOutline",
    "selected": true
  },
  {
    "variant": "neutralSolid",
    "selected": false,
    "pressed": true,
    "disabled": false
  },
  {
    "variant": "neutralOutline",
    "selected": false,
    "pressed": true,
    "disabled": false
  },
  {
    "variant": "neutralSolid",
    "selected": true,
    "pressed": true,
    "disabled": false
  },
  {
    "variant": "neutralOutline",
    "selected": true,
    "pressed": true,
    "disabled": false
  },
  {
    "variant": "neutralSolid",
    "disabled": true
  },
  {
    "variant": "neutralOutline",
    "disabled": true
  },
  {
    "selected": false,
    "inCarousel": true
  }
];

export const chipTabsVariantMap = {
  "extendSafeAreaX": [
    true,
    false
  ],
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
  ],
  "selected": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "inCarousel": [
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const chipTabsSeedTagSpec = {
  name: "ChipTablist",
  axes: ["variant"],
  defaults: { variant: "neutralSolid" },
};
