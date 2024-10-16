import { createClassName } from "./className.mjs";

const badgeSlotNames = [
  [
    "root",
    "badge__root"
  ],
  [
    "label",
    "badge__label"
  ]
];

const defaultVariant = {};

const compoundVariants = [
  {
    "shape": "rectangle",
    "size": "medium"
  },
  {
    "shape": "rectangle",
    "size": "small"
  },
  {
    "tone": "neutral",
    "variant": "soft"
  },
  {
    "tone": "neutral",
    "variant": "solid"
  },
  {
    "tone": "neutral",
    "variant": "outlined"
  },
  {
    "tone": "brand",
    "variant": "soft"
  },
  {
    "tone": "brand",
    "variant": "solid"
  },
  {
    "tone": "brand",
    "variant": "outlined"
  },
  {
    "tone": "informative",
    "variant": "soft"
  },
  {
    "tone": "informative",
    "variant": "solid"
  },
  {
    "tone": "informative",
    "variant": "outlined"
  },
  {
    "tone": "positive",
    "variant": "soft"
  },
  {
    "tone": "positive",
    "variant": "solid"
  },
  {
    "tone": "positive",
    "variant": "outlined"
  },
  {
    "tone": "danger",
    "variant": "soft"
  },
  {
    "tone": "danger",
    "variant": "solid"
  },
  {
    "tone": "danger",
    "variant": "outlined"
  }
];

export const badgeVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "shape": [
    "rectangle",
    "pill"
  ],
  "variant": [
    "soft",
    "solid",
    "outlined"
  ],
  "tone": [
    "neutral",
    "brand",
    "informative",
    "positive",
    "danger"
  ]
};

export const badgeVariantKeys = Object.keys(badgeVariantMap);

export function badge(props) {
  return Object.fromEntries(
    badgeSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}