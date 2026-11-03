import './avatar.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const avatarSlotNames = [
  [
    "root",
    "seed-avatar__root"
  ],
  [
    "imageContainer",
    "seed-avatar__imageContainer"
  ],
  [
    "pendingImageContainer",
    "seed-avatar__pendingImageContainer"
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
  "size": 48,
  "badgeMask": "none"
};

const compoundVariants = [];

export const avatarVariantMap = {
  "badgeMask": [
    "none",
    "circle",
    "flower",
    "shield"
  ],
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
  return createSlots(avatarSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(avatar, { splitVariantProps: (props) => splitVariantProps(props, avatarVariantMap) });

// @recipe(seed): avatar