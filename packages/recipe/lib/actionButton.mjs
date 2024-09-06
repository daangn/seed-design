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
    "prefix",
    "actionButton__prefix"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

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