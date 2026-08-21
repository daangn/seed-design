import './checkmark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const checkmarkSlotNames = [
  [
    "root",
    "seed-checkmark__root"
  ],
  [
    "icon",
    "seed-checkmark__icon"
  ]
];

const defaultVariant = {
  "variant": "square",
  "tone": "brand",
  "size": "medium",
  "checked": false,
  "disabled": false,
  "indeterminate": false,
  "pressed": false
};

const compoundVariants = [
  {
    "variant": "square",
    "size": "medium"
  },
  {
    "variant": "square",
    "size": "large"
  },
  {
    "variant": "ghost",
    "size": "medium"
  },
  {
    "variant": "ghost",
    "size": "large"
  },
  {
    "variant": "square",
    "checked": false,
    "indeterminate": false
  },
  {
    "variant": "square",
    "checked": true,
    "disabled": false
  },
  {
    "variant": "square",
    "indeterminate": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "brand",
    "checked": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "neutral",
    "checked": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "brand",
    "indeterminate": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "neutral",
    "indeterminate": true,
    "disabled": false
  },
  {
    "variant": "square",
    "disabled": true
  },
  {
    "variant": "square",
    "checked": true,
    "disabled": true
  },
  {
    "variant": "square",
    "indeterminate": true,
    "disabled": true
  },
  {
    "variant": "ghost",
    "tone": "brand",
    "checked": true,
    "disabled": false
  },
  {
    "variant": "ghost",
    "tone": "neutral",
    "checked": true,
    "disabled": false
  },
  {
    "variant": "ghost",
    "disabled": true
  },
  {
    "variant": "ghost",
    "checked": true,
    "disabled": true
  },
  {
    "variant": "square",
    "pressed": true,
    "checked": false,
    "indeterminate": false,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "brand",
    "pressed": true,
    "checked": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "neutral",
    "pressed": true,
    "checked": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "brand",
    "pressed": true,
    "indeterminate": true,
    "disabled": false
  },
  {
    "variant": "square",
    "tone": "neutral",
    "pressed": true,
    "indeterminate": true,
    "disabled": false
  },
  {
    "variant": "ghost",
    "pressed": true,
    "checked": false,
    "indeterminate": false,
    "disabled": false
  },
  {
    "variant": "ghost",
    "tone": "brand",
    "pressed": true,
    "checked": true,
    "disabled": false
  },
  {
    "variant": "ghost",
    "tone": "neutral",
    "pressed": true,
    "checked": true,
    "disabled": false
  }
];

export const checkmarkVariantMap = {
  "variant": [
    "square",
    "ghost"
  ],
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
  "indeterminate": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ]
};

export const checkmarkVariantKeys = Object.keys(checkmarkVariantMap);

export function checkmark(props) {
  return Object.fromEntries(
    checkmarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkmark, { splitVariantProps: (props) => splitVariantProps(props, checkmarkVariantMap) });

// @recipe(seed): checkmark