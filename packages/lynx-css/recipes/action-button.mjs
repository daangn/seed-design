import './action-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const actionButtonSlotNames = [
  [
    "root",
    "seed-action-button__root"
  ],
  [
    "content",
    "seed-action-button__content"
  ],
  [
    "text",
    "seed-action-button__text"
  ],
  [
    "prefixIcon",
    "seed-action-button__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-action-button__suffixIcon"
  ],
  [
    "icon",
    "seed-action-button__icon"
  ],
  [
    "loadingIndicator",
    "seed-action-button__loadingIndicator"
  ]
];

const defaultVariant = {
  "variant": "brandSolid",
  "size": "medium",
  "layout": "withText",
  "pressed": false,
  "disabled": false,
  "loading": false
};

const compoundVariants = [
  {
    "size": "xsmall",
    "layout": "withText"
  },
  {
    "size": "xsmall",
    "layout": "iconOnly"
  },
  {
    "size": "small",
    "layout": "withText"
  },
  {
    "size": "small",
    "layout": "iconOnly"
  },
  {
    "size": "medium",
    "layout": "withText"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "large",
    "layout": "withText"
  },
  {
    "size": "large",
    "layout": "iconOnly"
  },
  {
    "variant": "brandSolid",
    "pressed": true
  },
  {
    "variant": "neutralSolid",
    "pressed": true
  },
  {
    "variant": "neutralWeak",
    "pressed": true
  },
  {
    "variant": "criticalSolid",
    "pressed": true
  },
  {
    "variant": "brandOutline",
    "pressed": true
  },
  {
    "variant": "neutralOutline",
    "pressed": true
  },
  {
    "variant": "ghost",
    "pressed": true
  },
  {
    "variant": "brandSolid",
    "disabled": true
  },
  {
    "variant": "neutralSolid",
    "disabled": true
  },
  {
    "variant": "neutralWeak",
    "disabled": true
  },
  {
    "variant": "criticalSolid",
    "disabled": true
  },
  {
    "variant": "brandOutline",
    "disabled": true
  },
  {
    "variant": "neutralOutline",
    "disabled": true
  },
  {
    "variant": "ghost",
    "disabled": true
  },
  {
    "variant": "brandSolid",
    "loading": true
  },
  {
    "variant": "neutralSolid",
    "loading": true
  },
  {
    "variant": "neutralWeak",
    "loading": true
  },
  {
    "variant": "criticalSolid",
    "loading": true
  },
  {
    "variant": "brandOutline",
    "loading": true
  },
  {
    "variant": "neutralOutline",
    "loading": true
  },
  {
    "variant": "ghost",
    "loading": true
  }
];

export const actionButtonVariantMap = {
  "variant": [
    "brandSolid",
    "neutralSolid",
    "neutralWeak",
    "criticalSolid",
    "brandOutline",
    "neutralOutline",
    "ghost"
  ],
  "size": [
    "xsmall",
    "small",
    "medium",
    "large"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "loading": [
    true,
    false
  ]
};

export const actionButtonVariantKeys = Object.keys(actionButtonVariantMap);

export function actionButton(props) {
  return Object.fromEntries(
    actionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(actionButton, { splitVariantProps: (props) => splitVariantProps(props, actionButtonVariantMap) });

// @recipe(seed): action-button