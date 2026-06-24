import './side-panel.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sidePanelSlotNames = [
  [
    "positioner",
    "seed-side-panel__positioner"
  ],
  [
    "backdrop",
    "seed-side-panel__backdrop"
  ],
  [
    "content",
    "seed-side-panel__content"
  ],
  [
    "header",
    "seed-side-panel__header"
  ],
  [
    "body",
    "seed-side-panel__body"
  ],
  [
    "footer",
    "seed-side-panel__footer"
  ],
  [
    "title",
    "seed-side-panel__title"
  ],
  [
    "description",
    "seed-side-panel__description"
  ],
  [
    "closeButton",
    "seed-side-panel__closeButton"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const sidePanelVariantMap = {
  "size": [
    "small",
    "medium",
    "large"
  ]
};

export const sidePanelVariantKeys = Object.keys(sidePanelVariantMap);

export function sidePanel(props) {
  return Object.fromEntries(
    sidePanelSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(sidePanel, { splitVariantProps: (props) => splitVariantProps(props, sidePanelVariantMap) });

// @recipe(seed): side-panel