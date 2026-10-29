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
    "placeholder",
    "seed-segmented-text-input__placeholder"
  ],
  [
    "placeholderBeforeSuffix",
    "seed-segmented-text-input__placeholderBeforeSuffix"
  ],
  [
    "dots",
    "seed-segmented-text-input__dots"
  ],
  [
    "maskedDots",
    "seed-segmented-text-input__maskedDots"
  ],
  [
    "dot",
    "seed-segmented-text-input__dot"
  ],
  [
    "placeholderDot",
    "seed-segmented-text-input__placeholderDot"
  ],
  [
    "maskedDot",
    "seed-segmented-text-input__maskedDot"
  ],
  [
    "filledDot",
    "seed-segmented-text-input__filledDot"
  ],
  [
    "caret",
    "seed-segmented-text-input__caret"
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
    "maskedReadOnlyText",
    "seed-segmented-text-input__maskedReadOnlyText"
  ],
  [
    "staticText",
    "seed-segmented-text-input__staticText"
  ],
  [
    "staticContent",
    "seed-segmented-text-input__staticContent"
  ],
  [
    "staticPrefix",
    "seed-segmented-text-input__staticPrefix"
  ],
  [
    "staticSuffix",
    "seed-segmented-text-input__staticSuffix"
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