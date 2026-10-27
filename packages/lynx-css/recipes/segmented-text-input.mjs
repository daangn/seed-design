import './segmented-text-input.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const segmentedTextInputSlotNames = [
  [
    "root",
    "seed-segmented-text-input__root"
  ],
  [
    "baseStroke",
    "seed-segmented-text-input__baseStroke"
  ],
  [
    "stroke",
    "seed-segmented-text-input__stroke"
  ],
  [
    "segment",
    "seed-segmented-text-input__segment"
  ],
  [
    "segmentFill",
    "seed-segmented-text-input__segmentFill"
  ],
  [
    "segmentCenter",
    "seed-segmented-text-input__segmentCenter"
  ],
  [
    "valueContainer",
    "seed-segmented-text-input__valueContainer"
  ],
  [
    "valueContainerFill",
    "seed-segmented-text-input__valueContainerFill"
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
    "maskedValue",
    "seed-segmented-text-input__maskedValue"
  ],
  [
    "readOnlyValue",
    "seed-segmented-text-input__readOnlyValue"
  ],
  [
    "readOnlyText",
    "seed-segmented-text-input__readOnlyText"
  ],
  [
    "readOnlyPlaceholder",
    "seed-segmented-text-input__readOnlyPlaceholder"
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
  "size": "large",
  "focused": false,
  "invalid": false,
  "readOnly": false,
  "disabled": false
};

const compoundVariants = [
  {
    "invalid": true,
    "focused": true
  },
  {
    "readOnly": true,
    "disabled": false
  }
];

export const segmentedTextInputVariantMap = {
  "size": [
    "large",
    "medium"
  ],
  "focused": [
    true,
    false
  ],
  "invalid": [
    true,
    false
  ],
  "readOnly": [
    true,
    false
  ],
  "disabled": [
    true,
    false
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