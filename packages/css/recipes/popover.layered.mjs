import './popover.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const popoverSlotNames = [
  [
    "positioner",
    "seed-popover__positioner"
  ],
  [
    "content",
    "seed-popover__content"
  ],
  [
    "header",
    "seed-popover__header"
  ],
  [
    "body",
    "seed-popover__body"
  ],
  [
    "footer",
    "seed-popover__footer"
  ],
  [
    "title",
    "seed-popover__title"
  ],
  [
    "description",
    "seed-popover__description"
  ],
  [
    "closeButton",
    "seed-popover__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const popoverVariantMap = {};

export const popoverVariantKeys = Object.keys(popoverVariantMap);

export function popover(props) {
  return createSlots(popoverSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(popover, { splitVariantProps: (props) => splitVariantProps(props, popoverVariantMap) });

// @recipe(seed): popover