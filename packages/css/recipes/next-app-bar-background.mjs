import './next-app-bar-background.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const nextAppBarBackgroundSlotNames = [
  [
    "root",
    "seed-next-app-bar-background__root"
  ],
  [
    "blur",
    "seed-next-app-bar-background__blur"
  ],
  [
    "tint",
    "seed-next-app-bar-background__tint"
  ]
];

const defaultVariant = {
  "material": "progressiveBlur"
};

const compoundVariants = [];

export const nextAppBarBackgroundVariantMap = {
  "material": [
    "progressiveBlur",
    "transparent",
    "translucent"
  ]
};

export const nextAppBarBackgroundVariantKeys = Object.keys(nextAppBarBackgroundVariantMap);

export function nextAppBarBackground(props) {
  return Object.fromEntries(
    nextAppBarBackgroundSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(nextAppBarBackground, { splitVariantProps: (props) => splitVariantProps(props, nextAppBarBackgroundVariantMap) });

// @recipe(seed): next-app-bar-background