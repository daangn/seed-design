import { createClassName } from "./className.mjs";

const helpBubbleSlotNames = [
  [
    "positioner",
    "helpBubble__positioner"
  ],
  [
    "backdrop",
    "helpBubble__backdrop"
  ],
  [
    "content",
    "helpBubble__content"
  ],
  [
    "arrow",
    "helpBubble__arrow"
  ],
  [
    "title",
    "helpBubble__title"
  ],
  [
    "description",
    "helpBubble__description"
  ]
];

const defaultVariant = {
  "variant": "nonModal"
};

const compoundVariants = [];

export const helpBubbleVariantMap = {
  "variant": [
    "nonModal",
    "modal"
  ]
};

export const helpBubbleVariantKeys = Object.keys(helpBubbleVariantMap);

export function helpBubble(props) {
  return Object.fromEntries(
    helpBubbleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}