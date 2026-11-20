import './bottom-sheet-handle.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
  return Object.fromEntries(
    bottomSheetHandleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(bottomSheetHandle, { splitVariantProps: (props) => splitVariantProps(props, bottomSheetHandleVariantMap) });

// @recipe(seed): bottom-sheet-handle

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const bottomSheetHandleSeedTagSpec = {
  name: "BottomSheetHandle",
  axes: [],
  defaults: {},
};
