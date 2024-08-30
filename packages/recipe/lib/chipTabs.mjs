import { createClassName } from "./className.mjs";

const chipTabsSlotNames = [
  [
    "root",
    "chipTabs__root"
  ],
  [
    "triggerList",
    "chipTabs__triggerList"
  ],
  [
    "contentList",
    "chipTabs__contentList"
  ],
  [
    "contentCamera",
    "chipTabs__contentCamera"
  ],
  [
    "content",
    "chipTabs__content"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const chipTabsVariantMap = {};

export const chipTabsVariantKeys = Object.keys(chipTabsVariantMap);

export function chipTabs(props) {
  return Object.fromEntries(
    chipTabsSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}