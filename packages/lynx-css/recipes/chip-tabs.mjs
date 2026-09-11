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