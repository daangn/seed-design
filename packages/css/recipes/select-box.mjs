import './select-box.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxSlotNames = [
  [
    "root",
    "seed-select-box__root"
  ],
  [
    "foo",
    "seed-select-box__foo"
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