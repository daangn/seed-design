import './page-banner.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const pageBannerSlotNames = [
  [
    "root",
    "seed-page-banner__root"
  ],
  [
    "content",
    "seed-page-banner__content"
  ],
  [
    "body",
    "seed-page-banner__body"
  ],
  [
    "title",
    "seed-page-banner__title"
  ],
  [
    "description",
    "seed-page-banner__description"
  ],
  [
    "button",
    "seed-page-banner__button"
  ],
  [
    "closeButton",
    "seed-page-banner__closeButton"
  ]
];

const defaultVariant = {
  "tone": "neutral",
  "variant": "weak"
};

const compoundVariants = [
  {
    "tone": "neutral",
    "variant": "weak"
  },
  {
    "tone": "neutral",
    "variant": "solid"
  },
  {
    "tone": "informative",
    "variant": "weak"
  },
  {
    "tone": "informative",
    "variant": "solid"
  },
  {
    "tone": "positive",
    "variant": "weak"
  },
  {
    "tone": "positive",
    "variant": "solid"
  },
  {
    "tone": "warning",
    "variant": "weak"
  },
  {
    "tone": "warning",
    "variant": "solid"
  },
  {
    "tone": "critical",
    "variant": "weak"
  },
  {
    "tone": "critical",
    "variant": "solid"
  },
  {
    "tone": "magic",
    "variant": "weak"
  }
];

export const pageBannerVariantMap = {
  "variant": [
    "weak",
    "solid"
  ],
  "tone": [
    "neutral",
    "informative",
    "positive",
    "warning",
    "critical",
    "magic"
  ]
};

export const pageBannerVariantKeys = Object.keys(pageBannerVariantMap);

export function pageBanner(props) {
  return Object.fromEntries(
    pageBannerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(pageBanner, { splitVariantProps: (props) => splitVariantProps(props, pageBannerVariantMap) });

// @recipe(seed): page-banner