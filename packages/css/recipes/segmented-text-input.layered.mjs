import './segmented-text-input.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const segmentedTextInputSlotNames = [
  [
    "root",
    "seed-segmented-text-input__root"
  ],
  [
    "segment",
    "seed-segmented-text-input__segment"
  ],
  [
    "valueContainer",
    "seed-segmented-text-input__valueContainer"
  ],
  [
    "valueSizer",
    "seed-segmented-text-input__valueSizer"
  ],
  [
    "value",
    "seed-segmented-text-input__value"
  ],
  [
    "placeholder",
    "seed-segmented-text-input__placeholder"
  ],
  [
    "dots",
    "seed-segmented-text-input__dots"
  ],
  [
    "dot",
    "seed-segmented-text-input__dot"
  ],
  [
    "caret",
    "seed-segmented-text-input__caret"
  ],
  [
    "staticText",
    "seed-segmented-text-input__staticText"
  ],
  [
    "separator",
    "seed-segmented-text-input__separator"
  ],
  [
    "suffix",
    "seed-segmented-text-input__suffix"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const segmentedTextInputVariantMap = {
  "size": [
    "large",
    "medium"
  ]
};

export const segmentedTextInputVariantKeys = Object.keys(segmentedTextInputVariantMap);

export function segmentedTextInput(props) {
  return Object.fromEntries(
    segmentedTextInputSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(segmentedTextInput, { splitVariantProps: (props) => splitVariantProps(props, segmentedTextInputVariantMap) });

// @recipe(seed): segmented-text-input