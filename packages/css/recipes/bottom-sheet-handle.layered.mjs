import './bottom-sheet-handle.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const bottomSheetHandleSlotNames = [
  [
    "root",
    "seed-bottom-sheet-handle__root"
  ],
  [
    "touchArea",
    "seed-bottom-sheet-handle__touchArea"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const bottomSheetHandleVariantMap = {};

export const bottomSheetHandleVariantKeys = Object.keys(bottomSheetHandleVariantMap);

export function bottomSheetHandle(props) {
  return createSlots(bottomSheetHandleSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(bottomSheetHandle, { splitVariantProps: (props) => splitVariantProps(props, bottomSheetHandleVariantMap) });

// @recipe(seed): bottom-sheet-handle