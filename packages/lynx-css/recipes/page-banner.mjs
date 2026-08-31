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
  ],
  [
    "prefixIcon",
    "seed-page-banner__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-page-banner__suffixIcon"
  ],
  [
    "closeIcon",
    "seed-page-banner__closeIcon"
  ]
];

const defaultVariant = {
  "tone": "neutral",
  "variant": "weak",
  "rootPressed": false,
  "buttonPressed": false,
  "closeButtonPressed": false
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
  },
  {
    "tone": "neutral",
    "variant": "weak",
    "rootPressed": true
  },
  {
    "tone": "neutral",
    "variant": "solid",
    "rootPressed": true
  },
  {
    "tone": "informative",
    "variant": "weak",
    "rootPressed": true
  },
  {
    "tone": "informative",
    "variant": "solid",
    "rootPressed": true
  },
  {
    "tone": "positive",
    "variant": "weak",
    "rootPressed": true
  },
  {
    "tone": "positive",
    "variant": "solid",
    "rootPressed": true
  },
  {
    "tone": "warning",
    "variant": "weak",
    "rootPressed": true
  },
  {
    "tone": "warning",
    "variant": "solid",
    "rootPressed": true
  },
  {
    "tone": "critical",
    "variant": "weak",
    "rootPressed": true
  },
  {
    "tone": "critical",
    "variant": "solid",
    "rootPressed": true
  },
  {
    "tone": "magic",
    "variant": "weak",
    "rootPressed": true
  }
];

export const pageBannerVariantMap = {
  "tone": [
    "neutral",
    "informative",
    "positive",
    "warning",
    "critical",
    "magic"
  ],
  "variant": [
    "weak",
    "solid"
  ],
  "rootPressed": [
    true,
    false
  ],
  "buttonPressed": [
    true,
    false
  ],
  "closeButtonPressed": [
    true,
    false
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