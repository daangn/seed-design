import './select-box.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxSlotNames = [
  [
    "root",
    "ride-select-box__root"
  ],
  [
    "trigger",
    "ride-select-box__trigger"
  ],
  [
    "content",
    "ride-select-box__content"
  ],
  [
    "body",
    "ride-select-box__body"
  ],
  [
    "label",
    "ride-select-box__label"
  ],
  [
    "description",
    "ride-select-box__description"
  ],
  [
    "footer",
    "ride-select-box__footer"
  ]
];

const defaultVariant = {
  "layout": "horizontal"
};

const compoundVariants = [];

export const selectBoxVariantMap = {
  "layout": [
    "horizontal",
    "vertical"
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