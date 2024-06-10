import { createClassName } from "./className.mjs";

const boxButtonSlotNames = [
  [
    "root",
    "boxButton__root"
  ],
  [
    "label",
    "boxButton__label"
  ],
  [
    "prefix",
    "boxButton__prefix"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const boxButtonVariantMap = {
  "variant": [
    "brand",
    "brandSoft",
    "neutral",
    "danger"
  ],
  "size": [
    "xsmall",
    "small",
    "medium",
    "large",
    "xlarge"
  ]
};

export const boxButtonVariantKeys = Object.keys(boxButtonVariantMap);

export function boxButton(props) {
  return Object.fromEntries(
    boxButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}