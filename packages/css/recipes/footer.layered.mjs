import './footer.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const footerSlotNames = [
  [
    "linkText",
    "seed-footer__linkText"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const footerVariantMap = {
  "size": [
    "large",
    "medium"
  ]
};

export const footerVariantKeys = Object.keys(footerVariantMap);

export function footer(props) {
  return Object.fromEntries(
    footerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(footer, { splitVariantProps: (props) => splitVariantProps(props, footerVariantMap) });

// @recipe(seed): footer