import { createClassName } from "./className.mjs";

const actionButtonSlotNames = [
  [
    "root",
    "actionButton__root"
  ],
  [
    "label",
    "actionButton__label"
  ],
  [
    "icon",
    "actionButton__icon"
  ],
  [
    "prefixIcon",
    "actionButton__prefixIcon"
  ],
  [
    "suffixIcon",
    "actionButton__suffixIcon"
  ]
];

const defaultVariant = {};

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
    "brandWeak",
    "neutralSolid",
    "neutralWeak",
    "dangerSolid"
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
  return Object.fromEntries(
    actionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}