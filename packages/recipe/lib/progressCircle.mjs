import { createClassName } from "./className.mjs";

const progressCircleSlotNames = [
  [
    "root",
    "progressCircle__root"
  ],
  [
    "track",
    "progressCircle__track"
  ],
  [
    "indicator",
    "progressCircle__indicator"
  ],
  [
    "indicator-path",
    "progressCircle__indicator-path"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const progressCircleVariantMap = {
  "size": [
    "small",
    "medium"
  ],
  "variant": [
    "indeterminate",
    "determinate"
  ]
};

export const progressCircleVariantKeys = Object.keys(progressCircleVariantMap);

export function progressCircle(props) {
  return Object.fromEntries(
    progressCircleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}