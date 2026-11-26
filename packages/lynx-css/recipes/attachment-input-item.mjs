import './attachment-input-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const attachmentInputItemSlotNames = [
  [
    "root",
    "seed-attachment-input-item__root"
  ],
  [
    "surface",
    "seed-attachment-input-item__surface"
  ],
  [
    "image",
    "seed-attachment-input-item__image"
  ],
  [
    "thumbnail",
    "seed-attachment-input-item__thumbnail"
  ],
  [
    "thumbnailIcon",
    "seed-attachment-input-item__thumbnailIcon"
  ],
  [
    "metadata",
    "seed-attachment-input-item__metadata"
  ],
  [
    "name",
    "seed-attachment-input-item__name"
  ],
  [
    "size",
    "seed-attachment-input-item__size"
  ],
  [
    "badge",
    "seed-attachment-input-item__badge"
  ],
  [
    "badgeLabel",
    "seed-attachment-input-item__badgeLabel"
  ],
  [
    "durationBadge",
    "seed-attachment-input-item__durationBadge"
  ],
  [
    "durationBadgeLabel",
    "seed-attachment-input-item__durationBadgeLabel"
  ],
  [
    "backdrop",
    "seed-attachment-input-item__backdrop"
  ],
  [
    "actionButton",
    "seed-attachment-input-item__actionButton"
  ],
  [
    "actionIcon",
    "seed-attachment-input-item__actionIcon"
  ],
  [
    "actionLabel",
    "seed-attachment-input-item__actionLabel"
  ],
  [
    "removeButton",
    "seed-attachment-input-item__removeButton"
  ],
  [
    "removeIcon",
    "seed-attachment-input-item__removeIcon"
  ]
];

const defaultVariant = {
  "type": "general",
  "removePressed": false,
  "pressed": false,
  "readOnly": false,
  "dragging": false,
  "disabled": false
};

const compoundVariants = [
  {
    "readOnly": false
  },
  {
    "readOnly": false,
    "removePressed": true
  },
  {
    "type": "image",
    "readOnly": true
  },
  {
    "type": "image",
    "dragging": true
  }
];

export const attachmentInputItemVariantMap = {
  "type": [
    "general",
    "image"
  ],
  "removePressed": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "readOnly": [
    true,
    false
  ],
  "dragging": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ]
};

export const attachmentInputItemVariantKeys = Object.keys(attachmentInputItemVariantMap);

export function attachmentInputItem(props) {
  return Object.fromEntries(
    attachmentInputItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(attachmentInputItem, { splitVariantProps: (props) => splitVariantProps(props, attachmentInputItemVariantMap) });

// @recipe(seed): attachment-input-item

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const attachmentInputItemSeedTagSpec = {
  name: "AttachmentInputItem",
  axes: ["type"],
  defaults: { type: "general" },
};
