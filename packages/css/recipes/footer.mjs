import './footer.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(footerSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(footer, { splitVariantProps: (props) => splitVariantProps(props, footerVariantMap) });

// @recipe(seed): footer