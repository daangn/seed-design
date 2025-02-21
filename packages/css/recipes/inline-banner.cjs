const { createClassName } = require("./className.cjs");
const { mergeVariants } = require("./mergeVariants.cjs");
const { splitVariantProps } = require("./splitVariantProps.cjs");

const inlineBannerSlotNames = [
  [
    "root",
    "seed-inline-banner__root"
  ],
  [
    "content",
    "seed-inline-banner__content"
  ],
  [
    "title",
    "seed-inline-banner__title"
  ],
  [
    "description",
    "seed-inline-banner__description"
  ],
  [
    "link",
    "seed-inline-banner__link"
  ],
  [
    "closeButton",
    "seed-inline-banner__closeButton"
  ]
];

const defaultVariant = {
  "variant": "neutralWeak"
};

const compoundVariants = [];

const inlineBannerVariantMap = {
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

const inlineBannerVariantKeys = Object.keys(inlineBannerVariantMap);

function inlineBanner(props) {
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

module.exports = inlineBanner;
module.exports.inlineBannerVariantMap = inlineBannerVariantMap;
module.exports.inlineBannerVariantKeys = inlineBannerVariantKeys;