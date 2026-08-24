import './wheel-picker-public.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const wheelPickerPublicSlotNames = [
  [
    "root",
    "seed-wheel-picker-public__root"
  ],
  [
    "scrollFog",
    "seed-wheel-picker-public__scrollFog"
  ],
  [
    "columns",
    "seed-wheel-picker-public__columns"
  ],
  [
    "column",
    "seed-wheel-picker-public__column"
  ],
  [
    "item",
    "seed-wheel-picker-public__item"
  ],
  [
    "itemLabel",
    "seed-wheel-picker-public__itemLabel"
  ],
  [
    "selectionIndicator",
    "seed-wheel-picker-public__selectionIndicator"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const wheelPickerPublicVariantMap = {
  "size": [
    "small",
    "medium"
  ]
};

export const wheelPickerPublicVariantKeys = Object.keys(wheelPickerPublicVariantMap);

export function wheelPickerPublic(props) {
  return Object.fromEntries(
    wheelPickerPublicSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(wheelPickerPublic, { splitVariantProps: (props) => splitVariantProps(props, wheelPickerPublicVariantMap) });

// @recipe(seed): wheel-picker-public