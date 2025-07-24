import './editor-toolbar.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const editorToolbarSlotNames = [
  [
    "root",
    "seed-editor-toolbar__root"
  ],
  [
    "item",
    "seed-editor-toolbar__item"
  ],
  [
    "label",
    "seed-editor-toolbar__label"
  ],
  [
    "icon",
    "seed-editor-toolbar__icon"
  ],
  [
    "prefixIcon",
    "seed-editor-toolbar__prefixIcon"
  ]
];

const defaultVariant = {
  "layout": "iconWithText",
  "showKeyboard": false
};

const compoundVariants = [];

export const editorToolbarVariantMap = {
  "layout": [
    "iconWithText",
    "iconOnly"
  ],
  "showKeyboard": [
    false,
    true
  ]
};

export const editorToolbarVariantKeys = Object.keys(editorToolbarVariantMap);

export function editorToolbar(props) {
  return Object.fromEntries(
    editorToolbarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(editorToolbar, { splitVariantProps: (props) => splitVariantProps(props, editorToolbarVariantMap) });

// @recipe(seed): editor-toolbar