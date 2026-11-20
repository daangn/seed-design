import './menu-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuItemSlotNames = [
  [
    "root",
    "seed-menu-item__root"
  ],
  [
    "scaleContent",
    "seed-menu-item__scaleContent"
  ],
  [
    "pressedOverlay",
    "seed-menu-item__pressedOverlay"
  ],
  [
    "body",
    "seed-menu-item__body"
  ],
  [
    "label",
    "seed-menu-item__label"
  ],
  [
    "description",
    "seed-menu-item__description"
  ],
  [
    "prefixIcon",
    "seed-menu-item__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-menu-item__suffixIcon"
  ]
];

const defaultVariant = {
  "size": "medium",
  "tone": "neutral",
  "disabled": false,
  "pressed": false
};

const compoundVariants = [
  {
    "tone": "neutral",
    "disabled": false
  },
  {
    "tone": "critical",
    "disabled": false
  },
  {
    "pressed": true,
    "disabled": false
  }
];

export const menuItemVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "tone": [
    "neutral",
    "critical"
  ],
  "disabled": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ]
};

export const menuItemVariantKeys = Object.keys(menuItemVariantMap);

export function menuItem(props) {
  return Object.fromEntries(
    menuItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(menuItem, { splitVariantProps: (props) => splitVariantProps(props, menuItemVariantMap) });

// @recipe(seed): menu-item

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const menuItemSeedTagSpec = {
  name: "MenuItem",
  axes: ["size", "tone"],
  defaults: { size: "medium", tone: "neutral" },
};
