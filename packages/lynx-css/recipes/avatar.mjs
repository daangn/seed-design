import './avatar.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const avatarSlotNames = [
  [
    "root",
    "seed-avatar__root"
  ],
  [
    "image",
    "seed-avatar__image"
  ],
  [
    "pendingImage",
    "seed-avatar__pendingImage"
  ],
  [
    "fallback",
    "seed-avatar__fallback"
  ],
  [
    "badge",
    "seed-avatar__badge"
  ],
  [
    "stroke",
    "seed-avatar__stroke"
  ]
];

const defaultVariant = {
  "size": 48
};

const compoundVariants = [];

export const avatarVariantMap = {
  "size": [
    "20",
    "24",
    "36",
    "42",
    "48",
    "56",
    "64",
    "80",
    "96",
    "108"
  ]
};

export const avatarVariantKeys = Object.keys(avatarVariantMap);

export function avatar(props) {
  return Object.fromEntries(
    avatarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(avatar, { splitVariantProps: (props) => splitVariantProps(props, avatarVariantMap) });

// @recipe(seed): avatar