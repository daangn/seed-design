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
    "fallback",
    "seed-avatar__fallback"
  ],
  [
    "badge",
    "seed-avatar__badge"
  ]
];

const defaultVariant = {
  "size": 48,
  "badgeMask": "none"
};

const compoundVariants = [];

export const avatarVariantMap = {
  "size": [
    "20",
    "24",
    "36",
    "42",
    "48",
    "64",
    "80",
    "96",
    "108"
  ],
  "badgeMask": [
    "none",
    "circle",
    "flower",
    "shield"
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