import './select-box.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxSlotNames = [
  [
    "root",
    "seed-select-box__root"
  ],
  [
    "trigger",
    "seed-select-box__trigger"
  ],
  [
    "content",
    "seed-select-box__content"
  ],
  [
    "body",
    "seed-select-box__body"
  ],
  [
    "label",
    "seed-select-box__label"
  ],
  [
    "description",
    "seed-select-box__description"
  ],
  [
    "footer",
    "seed-select-box__footer"
  ]
];

const defaultVariant = {
  "layout": "horizontal",
  "selected": false,
  "pressed": false,
  "disabled": false
};

const compoundVariants = [
  {
    "selected": true,
    "disabled": true
  }
];

export const selectBoxVariantMap = {
  "layout": [
    "horizontal",
    "vertical"
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
  ]
};

export const selectBoxVariantKeys = Object.keys(selectBoxVariantMap);

export function selectBox(props) {
  return Object.fromEntries(
    selectBoxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBox, { splitVariantProps: (props) => splitVariantProps(props, selectBoxVariantMap) });

// @recipe(seed): select-box