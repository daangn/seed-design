import './manner-temp.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const mannerTempSlotNames = [
  [
    "root",
    "seed-manner-temp__root"
  ],
  [
    "label",
    "seed-manner-temp__label"
  ],
  [
    "emote",
    "seed-manner-temp__emote"
  ]
];

const defaultVariant = {
  "level": "l1"
};

const compoundVariants = [];

export const mannerTempVariantMap = {
  "level": [
    "l1",
    "l2",
    "l3",
    "l4",
    "l5",
    "l6",
    "l7",
    "l8",
    "l9",
    "l10"
  ]
};

export const mannerTempVariantKeys = Object.keys(mannerTempVariantMap);

export function mannerTemp(props) {
  return createSlots(mannerTempSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(mannerTemp, { splitVariantProps: (props) => splitVariantProps(props, mannerTempVariantMap) });

// @recipe(seed): manner-temp