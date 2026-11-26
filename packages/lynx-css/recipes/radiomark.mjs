import './radiomark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const radiomarkSlotNames = [
  [
    "root",
    "seed-radiomark__root"
  ],
  [
    "icon",
    "seed-radiomark__icon"
  ]
];

const defaultVariant = {
  "tone": "brand",
  "size": "medium",
  "checked": false,
  "disabled": false,
  "pressed": false
};

const compoundVariants = [
  {
    "tone": "brand",
    "checked": true,
    "disabled": false
  },
  {
    "tone": "neutral",
    "checked": true,
    "disabled": false
  },
  {
    "tone": "brand",
    "checked": false,
    "disabled": true
  },
  {
    "tone": "neutral",
    "checked": false,
    "disabled": true
  },
  {
    "tone": "brand",
    "checked": true,
    "disabled": true
  },
  {
    "tone": "neutral",
    "checked": true,
    "disabled": true
  },
  {
    "size": "medium",
    "checked": true,
    "disabled": true
  },
  {
    "size": "large",
    "checked": true,
    "disabled": true
  },
  {
    "pressed": true,
    "checked": false,
    "disabled": false
  },
  {
    "tone": "brand",
    "pressed": true,
    "checked": true,
    "disabled": false
  },
  {
    "tone": "neutral",
    "pressed": true,
    "checked": true,
    "disabled": false
  }
];

export const radiomarkVariantMap = {
  "tone": [
    "brand",
    "neutral"
  ],
  "size": [
    "medium",
    "large"
  ],
  "checked": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ]
};

export const radiomarkVariantKeys = Object.keys(radiomarkVariantMap);

export function radiomark(props) {
  return Object.fromEntries(
    radiomarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radiomark, { splitVariantProps: (props) => splitVariantProps(props, radiomarkVariantMap) });

// @recipe(seed): radiomark

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const radiomarkSeedTagSpec = {
  name: "Radiomark",
  axes: ["tone", "size"],
  defaults: { tone: "brand", size: "medium" },
};
