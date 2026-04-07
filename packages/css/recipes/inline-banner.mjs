import './inline-banner.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const inlineBannerSlotNames = [
  [
    "root",
    "ride-inline-banner__root"
  ],
  [
    "content",
    "ride-inline-banner__content"
  ],
  [
    "title",
    "ride-inline-banner__title"
  ],
  [
    "description",
    "ride-inline-banner__description"
  ],
  [
    "link",
    "ride-inline-banner__link"
  ],
  [
    "closeButton",
    "ride-inline-banner__closeButton"
  ]
];

const defaultVariant = {
  "variant": "neutralWeak"
};

const compoundVariants = [];

export const inlineBannerVariantMap = {
  "variant": [
    "neutralWeak",
    "positiveWeak",
    "informativeWeak",
    "warningWeak",
    "warningSolid",
    "criticalWeak",
    "criticalSolid"
  ]
};

export const inlineBannerVariantKeys = Object.keys(inlineBannerVariantMap);

export function inlineBanner(props) {
  return Object.fromEntries(
    inlineBannerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(inlineBanner, { splitVariantProps: (props) => splitVariantProps(props, inlineBannerVariantMap) });

// @recipe(seed): inline-banner