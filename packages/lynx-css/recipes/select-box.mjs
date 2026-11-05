import './select-box.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxSlotNames = [
  [
    "interactionRoot",
    "seed-select-box__interactionRoot"
  ],
  [
    "root",
    "seed-select-box__root"
  ],
  [
    "scaleContent",
    "seed-select-box__scaleContent"
  ],
  [
    "selectedStroke",
    "seed-select-box__selectedStroke"
  ],
  [
    "trigger",
    "seed-select-box__trigger"
  ],
  [
    "content",
    "seed-select-box__content"
  ],
  [
    "prefixIcon",
    "seed-select-box__prefixIcon"
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
  ],
  [
    "footerInner",
    "seed-select-box__footerInner"
  ]
];

const defaultVariant = {
  "layout": "horizontal",
  "selected": false,
  "pressed": false,
  "disabled": false,
  "footerOpen": false
};

const compoundVariants = [
  {
    "selected": true,
    "disabled": true
  },
  {
    "pressed": true,
    "disabled": true
  }
];

export const selectBoxVariantMap = {
  "layout": [
    "horizontal",
    "vertical"
  ],
  "selected": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "footerOpen": [
    true,
    false
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