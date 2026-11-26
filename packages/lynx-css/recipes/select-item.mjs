import './select-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectItemSlotNames = [
  [
    "root",
    "seed-select-item__root"
  ],
  [
    "scaleContent",
    "seed-select-item__scaleContent"
  ],
  [
    "pressedOverlay",
    "seed-select-item__pressedOverlay"
  ],
  [
    "body",
    "seed-select-item__body"
  ],
  [
    "label",
    "seed-select-item__label"
  ],
  [
    "description",
    "seed-select-item__description"
  ],
  [
    "prefixIcon",
    "seed-select-item__prefixIcon"
  ],
  [
    "indicator",
    "seed-select-item__indicator"
  ]
];

const defaultVariant = {
  "size": "large",
  "disabled": false,
  "selected": false,
  "pressed": false
};

const compoundVariants = [
  {
    "pressed": true,
    "disabled": false
  }
];

export const selectItemVariantMap = {
  "size": [
    "large",
    "medium"
  ],
  "disabled": [
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
  ]
};

export const selectItemVariantKeys = Object.keys(selectItemVariantMap);

export function selectItem(props) {
  return Object.fromEntries(
    selectItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectItem, { splitVariantProps: (props) => splitVariantProps(props, selectItemVariantMap) });

// @recipe(seed): select-item

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const selectItemSeedTagSpec = {
  name: "SelectItem",
  axes: ["size"],
  defaults: { size: "large" },
};
