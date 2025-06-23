import './action-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "variant": "brandSolid",
  "size": "medium",
  "layout": "withText"
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
  ]
};

export const actionButtonVariantKeys = Object.keys(actionButtonVariantMap);

export function actionButton(props) {
  return createClassName(
    "seed-action-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(actionButton, { splitVariantProps: (props) => splitVariantProps(props, actionButtonVariantMap) });

// @recipe(seed): action-button