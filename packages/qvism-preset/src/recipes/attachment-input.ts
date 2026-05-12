import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { engaged, disabled, focusVisible, not, pseudo, readOnly } from "../utils/pseudo";
import {
  attachmentInput as vars,
  attachmentInputItem as itemVars,
  attachmentInputItemActionButton as itemActionButtonVars,
  attachmentInputItemRemoveButton as itemRemoveButtonVars,
  attachmentInputTrigger as triggerVars,
  attachmentInputDropzone as dropzoneVars,
} from "../vars/component";
import type { Properties } from "csstype";

// Punches a circular hole at the remove button position so the gap stays
// transparent regardless of the surrounding layer background.
// (See avatar's badgeMask pattern — SVG keeps the edge crisper than radial-gradient,
// which produced visible blur even with a sub-pixel transition.)
const CIRCLE_SVG_MASK =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="white"/></svg>';

function toDataUrl(svg: string) {
  return `url('data:image/svg+xml;utf8,${svg}')`;
}

const removeButtonMask: Properties = {
  WebkitMaskImage: `linear-gradient(black, black), ${toDataUrl(CIRCLE_SVG_MASK)}`,
  WebkitMaskSize: "100% 100%, var(--remove-button-mask-size) var(--remove-button-mask-size)",
  WebkitMaskPosition:
    "0 0, right calc(0px - var(--remove-button-mask-offset)) top calc(0px - var(--remove-button-mask-offset))",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskComposite: "source-out",

  maskImage: `linear-gradient(black, black), ${toDataUrl(CIRCLE_SVG_MASK)}`,
  maskSize: "100% 100%, var(--remove-button-mask-size) var(--remove-button-mask-size)",
  maskPosition:
    "0 0, right calc(0px - var(--remove-button-mask-offset)) top calc(0px - var(--remove-button-mask-offset))",
  maskRepeat: "no-repeat",
  maskComposite: "subtract",

  transform: "translateZ(0)",
};

const attachmentInputTrigger = defineSlotRecipe({
  name: "attachment-input-trigger",
  slots: ["root", "icon", "itemCountArea", "itemCount", "maxItemCount"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      width: triggerVars.base.enabled.root.size,
      height: triggerVars.base.enabled.root.size,

      gap: triggerVars.base.enabled.root.gap,

      flexShrink: 0,

      border: "none",
      padding: 0,
      font: "inherit",
      boxShadow: `inset 0 0 0 ${triggerVars.base.enabled.root.strokeWidth} ${triggerVars.base.enabled.root.strokeColor}`,
      cursor: "pointer",
      backgroundColor: "transparent",
      borderRadius: triggerVars.base.enabled.root.cornerRadius,
      transition: `background-color 0.2s, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: triggerVars.base.pressed.root.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    icon: {
      width: triggerVars.base.enabled.icon.size,
      height: triggerVars.base.enabled.icon.size,
      color: triggerVars.base.enabled.icon.color,

      flexShrink: 0,

      [pseudo(disabled)]: {
        color: triggerVars.base.disabled.icon.color,
      },
    },
    itemCountArea: {
      // we define lineHeight here because some reset.css sets default line-height
      // e.g. tailwind preflight sets * { line-height: 1.5 }
      fontSize: triggerVars.base.enabled.itemCount.fontSize,
      lineHeight: triggerVars.base.enabled.itemCount.lineHeight,
    },
    itemCount: {
      color: triggerVars.base.enabled.itemCount.color,

      fontSize: triggerVars.base.enabled.itemCount.fontSize,
      lineHeight: triggerVars.base.enabled.itemCount.lineHeight,
      fontWeight: triggerVars.base.enabled.itemCount.fontWeight,

      [pseudo("[data-empty]")]: {
        color: triggerVars.base.enabled.maxItemCount.color,
      },

      [pseudo(disabled)]: {
        color: triggerVars.base.disabled.itemCount.color,
      },
    },
    maxItemCount: {
      color: triggerVars.base.enabled.maxItemCount.color,

      fontSize: triggerVars.base.enabled.maxItemCount.fontSize,
      lineHeight: triggerVars.base.enabled.maxItemCount.lineHeight,
      fontWeight: triggerVars.base.enabled.maxItemCount.fontWeight,

      [pseudo(disabled)]: {
        color: triggerVars.base.disabled.maxItemCount.color,
      },
    },
  },
  defaultVariants: {},
  variants: {},
});

const attachmentInputItem = defineSlotRecipe({
  name: "attachment-input-item",
  slots: [
    "root",
    "image",
    "thumbnail",
    "metadata",
    "name",
    "size",
    "badge",
    "badgeLabel",
    "backdrop",
    "actionButton",
    "removeButton",
  ],
  base: {
    root: {
      position: "relative",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: itemVars.base.enabled.root.gap,

      height: itemVars.base.enabled.root.height,
      borderRadius: itemVars.base.enabled.root.cornerRadius,

      "--remove-button-mask-size": itemVars.base.enabled.removeButtonMask.size,
      "--remove-button-mask-offset": itemVars.base.enabled.removeButtonMask.offset,

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",

        pointerEvents: "none",

        ...removeButtonMask,
      },

      [pseudo("[role='button']", not("[aria-grabbed=true]"), not("[data-readonly]"))]: {
        cursor: "grab",
      },

      [pseudo("[aria-grabbed=true]")]: {
        // Disable the remove button mask while dragging — see the slot's
        // description in attachment-input-item.yaml.
        "--remove-button-mask-size": "0px",
        "--remove-button-mask-offset": "0px",
      },
    },
    image: {
      width: "100%",
      height: "100%",

      objectFit: "cover",

      borderRadius: "inherit",

      ...removeButtonMask,
    },
    thumbnail: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      width: itemVars.base.enabled.thumbnail.size,
      height: itemVars.base.enabled.thumbnail.size,
      backgroundColor: itemVars.base.enabled.thumbnail.color,
      borderRadius: itemVars.base.enabled.thumbnail.cornerRadius,

      flexShrink: 0,

      ...onlyIcon({
        color: itemVars.base.enabled.thumbnailIcon.color,
        size: itemVars.base.enabled.thumbnailIcon.size,
      }),
    },
    metadata: {
      display: "flex",
      flexDirection: "column",
      width: "100%",

      flexGrow: 1,
    },
    name: {
      overflow: "hidden",
      wordBreak: "break-all",

      fontSize: itemVars.base.enabled.name.fontSize,
      lineHeight: itemVars.base.enabled.name.lineHeight,
      fontWeight: itemVars.base.enabled.name.fontWeight,
      color: itemVars.base.enabled.name.color,
    },
    size: {
      fontSize: itemVars.base.enabled.size.fontSize,
      lineHeight: itemVars.base.enabled.size.lineHeight,
      fontWeight: itemVars.base.enabled.size.fontWeight,
      color: itemVars.base.enabled.size.color,
    },
    backdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      display: "flex",
      flexDirection: "column", // just in case
      alignItems: "center",
      justifyContent: "center",

      borderRadius: "inherit",

      ...removeButtonMask,
    },
    actionButton: {
      width: "100%",
      height: "100%",

      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      textAlign: "center",

      border: "none",
      padding: 0,
      font: "inherit",
      background: "transparent",
      cursor: "pointer",
      borderRadius: "inherit",
      transition: FOCUS_RING_TRANSITION,

      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      fontSize: itemActionButtonVars.base.enabled.label.fontSize,
      lineHeight: itemActionButtonVars.base.enabled.label.lineHeight,
      fontWeight: itemActionButtonVars.base.enabled.label.fontWeight,

      gap: itemActionButtonVars.base.enabled.root.gap,

      ...onlyIcon({
        size: itemActionButtonVars.base.enabled.icon.size,
      }),
    },
    removeButton: {
      position: "absolute",
      top: `calc(${itemRemoveButtonVars.base.enabled.root.offset} * -1)`,
      right: `calc(${itemRemoveButtonVars.base.enabled.root.offset} * -1)`,

      width: itemRemoveButtonVars.base.enabled.root.size,
      height: itemRemoveButtonVars.base.enabled.root.size,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      padding: 0,
      backgroundColor: itemRemoveButtonVars.base.enabled.root.color,
      borderRadius: itemRemoveButtonVars.base.enabled.root.cornerRadius,
      cursor: "pointer",
      transition: `background-color 0.2s, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      boxShadow: `inset 0 0 0 ${itemRemoveButtonVars.base.enabled.root.strokeWidth} ${itemRemoveButtonVars.base.enabled.root.strokeColor}`,

      ...onlyIcon({
        size: itemRemoveButtonVars.base.enabled.icon.size,
        color: itemRemoveButtonVars.base.enabled.icon.color,
      }),

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: itemRemoveButtonVars.base.pressed.root.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        ...onlyIcon({
          color: itemRemoveButtonVars.base.disabled.icon.color,
        }),
      },

      // dnd-kit's useSortable sets [aria-grabbed=true] directly on the root <li>
      // and headless does not expose this state, so child slots can only react
      // via an ancestor selector. While dragging the mask is also disabled (size: 0),
      // so we hide the button to keep the interaction and visuals consistent.
      "[aria-grabbed=true] &": {
        display: "none",
      },
    },
  },
  variants: {
    type: {
      general: {
        root: {
          width: itemVars.typeFile.enabled.root.width,
          paddingLeft: itemVars.typeFile.enabled.root.paddingX,
          paddingRight: itemVars.typeFile.enabled.root.paddingX,

          "&::before": {
            boxShadow: `inset 0 0 0 ${itemVars.base.enabled.root.strokeWidth} ${itemVars.typeFile.enabled.root.strokeColor}`,
          },
        },
        thumbnail: {
          [pseudo("[data-has-overlay]")]: {
            display: "none",
          },

          [pseudo(readOnly)]: {
            ...onlyIcon({
              color: itemVars.typeFile.readonly.thumbnailIcon.color,
            }),
          },

          "[aria-grabbed=true] &": {
            ...onlyIcon({
              color: itemVars.typeFile.dragging.thumbnailIcon.color,
            }),
          },
        },
        metadata: {
          [pseudo("[data-has-overlay]")]: {
            display: "none",
          },
        },
        name: {
          [pseudo(readOnly)]: {
            color: itemVars.typeFile.readonly.name.color,
          },

          "[aria-grabbed=true] &": {
            color: itemVars.typeFile.dragging.name.color,
          },
        },
        size: {
          [pseudo(readOnly)]: {
            color: itemVars.typeFile.readonly.size.color,
          },

          "[aria-grabbed=true] &": {
            color: itemVars.typeFile.dragging.size.color,
          },
        },
        actionButton: {
          color: itemActionButtonVars.typeFile.enabled.label.color,

          ...onlyIcon({
            color: itemActionButtonVars.typeFile.enabled.icon.color,
          }),
        },
      },
      image: {
        root: {
          width: itemVars.typeImage.enabled.root.width,

          transition: "opacity 0.2s",

          "&::before": {
            boxShadow: `inset 0 0 0 ${itemVars.base.enabled.root.strokeWidth} ${itemVars.typeImage.enabled.root.strokeColor}`,
          },

          [pseudo(readOnly)]: {
            opacity: itemVars.typeImage.readonly.root.opacity,
          },

          [pseudo("[aria-grabbed=true]")]: {
            opacity: itemVars.typeImage.dragging.root.opacity,
          },
        },
        thumbnail: {
          display: "none",
        },
        metadata: {
          display: "none",
        },
        badge: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          height: itemVars.typeImage.enabled.badge.height,
          paddingLeft: itemVars.typeImage.enabled.badge.paddingX,
          paddingRight: itemVars.typeImage.enabled.badge.paddingX,

          backgroundColor: itemVars.typeImage.enabled.badge.color,
          borderRadius: `0 0 ${itemVars.typeImage.enabled.badge.cornerRadius} ${itemVars.typeImage.enabled.badge.cornerRadius}`,
        },
        badgeLabel: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          fontSize: itemVars.typeImage.enabled.badgeLabel.fontSize,
          lineHeight: itemVars.typeImage.enabled.badgeLabel.lineHeight,
          fontWeight: itemVars.typeImage.enabled.badgeLabel.fontWeight,
          color: itemVars.typeImage.enabled.badgeLabel.color,
        },
        backdrop: {
          background: itemVars.typeImage.enabled.backdrop.color,
        },
        actionButton: {
          color: itemActionButtonVars.typeImage.enabled.label.color,

          ...onlyIcon({
            color: itemActionButtonVars.typeImage.enabled.icon.color,
          }),
        },
      },
    },
  },
  defaultVariants: {
    type: "general",
  },
});

const attachmentInput = defineSlotRecipe({
  name: "attachment-input",
  slots: ["root", "dropzone", "dropzoneLabel", "container", "itemGroup"],
  base: {
    // wraps the dropzone and the container (the trigger (hidden when dropzone is used) and the file items)
    root: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.root.gap,

      marginLeft: "calc(var(--seed-attachment-input-extend-x) * -1)",
      marginRight: "calc(var(--seed-attachment-input-extend-x) * -1)",
    },
    dropzone: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      height: dropzoneVars.base.enabled.root.height,
      gap: dropzoneVars.base.enabled.root.gap,

      border: `${dropzoneVars.base.enabled.root.strokeWidth} dashed ${dropzoneVars.base.enabled.root.strokeColor}`,
      borderRadius: dropzoneVars.base.enabled.root.cornerRadius,

      paddingLeft: dropzoneVars.base.enabled.root.paddingX,
      paddingRight: dropzoneVars.base.enabled.root.paddingX,

      // counteract root's negative margin so the dropzone stays within the original bounds
      marginLeft: "var(--seed-attachment-input-extend-x)",
      marginRight: "var(--seed-attachment-input-extend-x)",

      transition: "border-color 0.2s",

      [pseudo("[data-dragging-over]")]: {
        borderStyle: "solid",
        borderColor: dropzoneVars.base.draggingOver.root.strokeColor,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    dropzoneLabel: {
      color: dropzoneVars.base.enabled.label.color,

      fontSize: dropzoneVars.base.enabled.label.fontSize,
      lineHeight: dropzoneVars.base.enabled.label.lineHeight,
      fontWeight: dropzoneVars.base.enabled.label.fontWeight,

      textAlign: "center",

      [pseudo(disabled)]: {
        color: dropzoneVars.base.disabled.label.color,
      },
    },
    // wraps the trigger and the file items
    container: {
      display: "flex",
      gap: vars.base.enabled.items.gap,

      // makes the container scrollable when there are many files
      overflowX: "auto",

      // keeps the icon removeButton's top from being cut off
      paddingTop: itemRemoveButtonVars.base.enabled.root.offset,
      marginTop: `calc(${itemRemoveButtonVars.base.enabled.root.offset} * -1)`,

      paddingLeft: "var(--seed-attachment-input-extend-x)",
      paddingRight: "var(--seed-attachment-input-extend-x)",
    },
    // wraps the file items
    itemGroup: {
      display: "flex",
      gap: vars.base.enabled.items.gap,

      listStyle: "none",
      padding: 0,
      margin: 0,
    },
  },
  variants: {},
  defaultVariants: {},
});

export { attachmentInput, attachmentInputTrigger, attachmentInputItem };
