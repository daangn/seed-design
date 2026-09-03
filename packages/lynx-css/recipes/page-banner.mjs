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
    "closeButtonIcon",
    "seed-page-banner__closeButtonIcon"
  ]
];

const defaultVariant = {
  "tone": "neutral",
  "variant": "weak",
  "pressed": false,
  "closeButtonPressed": false,
  "interactive": false
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
    "pressed": true
  },
  {
    "tone": "neutral",
    "variant": "solid",
    "pressed": true
  },
  {
    "tone": "informative",
    "variant": "weak",
    "pressed": true
  },
  {
    "tone": "informative",
    "variant": "solid",
    "pressed": true
  },
  {
    "tone": "positive",
    "variant": "weak",
    "pressed": true
  },
  {
    "tone": "positive",
    "variant": "solid",
    "pressed": true
  },
  {
    "tone": "warning",
    "variant": "weak",
    "pressed": true
  },
  {
    "tone": "warning",
    "variant": "solid",
    "pressed": true
  },
  {
    "tone": "critical",
    "variant": "weak",
    "pressed": true
  },
  {
    "tone": "critical",
    "variant": "solid",
    "pressed": true
  },
  {
    "tone": "magic",
    "variant": "weak",
    "pressed": true
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
  "pressed": [
    true,
    false
  ],
  "interactive": [
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