import { createClassName } from "./className.mjs";

const tabsSlotNames = [
  [
    "root",
    "tabs__root"
  ],
  [
    "triggerList",
    "tabs__triggerList"
  ],
  [
    "contentList",
    "tabs__contentList"
  ],
  [
    "contentCamera",
    "tabs__contentCamera"
  ],
  [
    "content",
    "tabs__content"
  ],
  [
    "indicator",
    "tabs__indicator"
  ]
];

const defaultVariant = {
  "layout": "hug"
};

const compoundVariants = [];

export const tabsVariantMap = {
  "layout": [
    "fill",
    "hug"
  ]
};

export const tabsVariantKeys = Object.keys(tabsVariantMap);

export function tabs(props) {
  return Object.fromEntries(
    tabsSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}