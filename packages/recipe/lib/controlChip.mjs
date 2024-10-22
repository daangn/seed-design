import { createClassName } from "./className.mjs";

const controlChipSlotNames = [
  [
    "root",
    "controlChip__root"
  ],
  [
    "label",
    "controlChip__label"
  ],
  [
    "icon",
    "controlChip__icon"
  ],
  [
    "prefixIcon",
    "controlChip__prefixIcon"
  ],
  [
    "suffixIcon",
    "controlChip__suffixIcon"
  ],
  [
    "count",
    "controlChip__count"
  ]
];

const defaultVariant = {};

const compoundVariants = [
  {
    "size": "medium",
    "layout": "withText"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "small",
    "layout": "withText"
  },
  {
    "size": "small",
    "layout": "iconOnly"
  }
];

export const controlChipVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ]
};

export const controlChipVariantKeys = Object.keys(controlChipVariantMap);

export function controlChip(props) {
  return Object.fromEntries(
    controlChipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}