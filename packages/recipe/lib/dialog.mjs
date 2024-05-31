import { createClassName } from "./className.mjs";

const dialogSlotNames = [
  [
    "backdrop",
    "dialog__backdrop"
  ],
  [
    "container",
    "dialog__container"
  ],
  [
    "content",
    "dialog__content"
  ],
  [
    "header",
    "dialog__header"
  ],
  [
    "footer",
    "dialog__footer"
  ],
  [
    "action",
    "dialog__action"
  ],
  [
    "title",
    "dialog__title"
  ],
  [
    "description",
    "dialog__description"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const dialogVariantMap = {
  "footerLayout": [
    "horizontal",
    "vertical"
  ]
};

export const dialogVariantKeys = Object.keys(dialogVariantMap);

export function dialog(props) {
  return Object.fromEntries(
    dialogSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}