import { createClassName } from "./className.mjs";

const avatarSlotNames = [
  [
    "root",
    "avatar__root"
  ],
  [
    "image",
    "avatar__image"
  ],
  [
    "fallback",
    "avatar__fallback"
  ],
  [
    "badge",
    "avatar__badge"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const avatarVariantMap = {
  "size": [
    "20",
    "24",
    "36",
    "48",
    "64",
    "80",
    "96"
  ]
};

export const avatarVariantKeys = Object.keys(avatarVariantMap);

export function avatar(props) {
  return Object.fromEntries(
    avatarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}