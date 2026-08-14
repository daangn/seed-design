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

      width: triggerVars.base.rest.root.size,
      height: triggerVars.base.rest.root.size,

      gap: triggerVars.base.rest.root.gap,

      flexShrink: 0,

      border: "none",
      padding: 0,
      font: "inherit",
      boxShadow: `inset 0 0 0 ${triggerVars.base.rest.root.strokeWidth} ${triggerVars.base.rest.root.strokeColor}`,
      cursor: "pointer",
      backgroundColor: "transparent",
      borderRadius: triggerVars.base.rest.root.cornerRadius,
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
      width: triggerVars.base.rest.icon.size,
      height: triggerVars.base.rest.icon.size,
      color: triggerVars.base.rest.icon.color,

      flexShrink: 0,

      [pseudo(disabled)]: {
        color: triggerVars.base.disabled.icon.color,
      },
    },
    itemCountArea: {
      // we define lineHeight here because some reset.css sets default line-height
      // e.g. tailwind preflight sets * { line-height: 1.5 }
      fontSize: triggerVars.base.rest.itemCount.fontSize,
      lineHeight: triggerVars.base.rest.itemCount.lineHeight,
    },
    itemCount: {
      color: triggerVars.base.rest.itemCount.color,

      fontSize: triggerVars.base.rest.itemCount.fontSize,
      lineHeight: triggerVars.base.rest.itemCount.lineHeight,
      fontWeight: triggerVars.base.rest.itemCount.fontWeight,

      [pseudo("[data-empty]")]: {
        color: triggerVars.base.rest.maxItemCount.color,
      },

      [pseudo(disabled)]: {
        color: triggerVars.base.disabled.itemCount.color,
      },
    },
    maxItemCount: {
      color: triggerVars.base.rest.maxItemCount.color,

      fontSize: triggerVars.base.rest.maxItemCount.fontSize,
      lineHeight: triggerVars.base.rest.maxItemCount.lineHeight,
      fontWeight: triggerVars.base.rest.maxItemCount.fontWeight,

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
      // Contain the image-type border's z-index (see the type=image `&::before`)
      // within the item so it cannot leak into the surrounding stacking context.
      isolation: "isolate",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: itemVars.base.rest.root.gap,

      height: itemVars.base.rest.root.height,
      borderRadius: itemVars.base.rest.root.cornerRadius,

      "--remove-button-mask-size": itemVars.base.rest.removeButtonMask.size,
      "--remove-button-mask-offset": itemVars.base.rest.removeButtonMask.offset,

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
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

      width: itemVars.base.rest.thumbnail.size,
      height: itemVars.base.rest.thumbnail.size,
      backgroundColor: itemVars.base.rest.thumbnail.color,
      borderRadius: itemVars.base.rest.thumbnail.cornerRadius,

      flexShrink: 0,

      ...onlyIcon({
        color: itemVars.base.rest.thumbnailIcon.color,
        size: itemVars.base.rest.thumbnailIcon.size,
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

      fontSize: itemVars.base.rest.name.fontSize,
      lineHeight: itemVars.base.rest.name.lineHeight,
      fontWeight: itemVars.base.rest.name.fontWeight,
      color: itemVars.base.rest.name.color,
    },
    size: {
      fontSize: itemVars.base.rest.size.fontSize,
      lineHeight: itemVars.base.rest.size.lineHeight,
      fontWeight: itemVars.base.rest.size.fontWeight,
      color: itemVars.base.rest.size.color,
    },
    backdrop: {
      position: "absolute",
      inset: 0,

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

      fontSize: itemActionButtonVars.base.rest.label.fontSize,
      lineHeight: itemActionButtonVars.base.rest.label.lineHeight,
      fontWeight: itemActionButtonVars.base.rest.label.fontWeight,

      gap: itemActionButtonVars.base.rest.root.gap,

      ...onlyIcon({
        size: itemActionButtonVars.base.rest.icon.size,
      }),
    },
    removeButton: {
      position: "absolute",
      top: `calc(${itemRemoveButtonVars.base.rest.root.offset} * -1)`,
      right: `calc(${itemRemoveButtonVars.base.rest.root.offset} * -1)`,

      width: itemRemoveButtonVars.base.rest.root.size,
      height: itemRemoveButtonVars.base.rest.root.size,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      padding: 0,
      backgroundColor: itemRemoveButtonVars.base.rest.root.color,
      borderRadius: itemRemoveButtonVars.base.rest.root.cornerRadius,
      cursor: "pointer",
      transition: `background-color 0.2s, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      boxShadow: `inset 0 0 0 ${itemRemoveButtonVars.base.rest.root.strokeWidth} ${itemRemoveButtonVars.base.rest.root.strokeColor}`,

      ...onlyIcon({
        size: itemRemoveButtonVars.base.rest.icon.size,
        color: itemRemoveButtonVars.base.rest.icon.color,
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
          width: itemVars.typeFile.rest.root.width,
          paddingInline: itemVars.typeFile.rest.root.paddingX,

          "&::before": {
            boxShadow: `inset 0 0 0 ${itemVars.base.rest.root.strokeWidth} ${itemVars.typeFile.rest.root.strokeColor}`,
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
          color: itemActionButtonVars.typeFile.rest.label.color,

          ...onlyIcon({
            color: itemActionButtonVars.typeFile.rest.icon.color,
          }),
        },
      },
      image: {
        root: {
          width: itemVars.typeImage.rest.root.width,

          transition: "opacity 0.2s",

          "&::before": {
            // The image and ::before both carry translateZ(0) (via removeButtonMask),
            // so each forms a stacking context. Without this, the <img> paints over
            // the border and hides it. Lift the border above the image.
            zIndex: 1,
            boxShadow: `inset 0 0 0 ${itemVars.base.rest.root.strokeWidth} ${itemVars.typeImage.rest.root.strokeColor}`,
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
          insetInline: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          height: itemVars.typeImage.rest.badge.height,
          paddingInline: itemVars.typeImage.rest.badge.paddingX,

          backgroundColor: itemVars.typeImage.rest.badge.color,
          borderRadius: `0 0 ${itemVars.typeImage.rest.badge.cornerRadius} ${itemVars.typeImage.rest.badge.cornerRadius}`,
        },
        badgeLabel: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          fontSize: itemVars.typeImage.rest.badgeLabel.fontSize,
          lineHeight: itemVars.typeImage.rest.badgeLabel.lineHeight,
          fontWeight: itemVars.typeImage.rest.badgeLabel.fontWeight,
          color: itemVars.typeImage.rest.badgeLabel.color,
        },
        backdrop: {
          background: itemVars.typeImage.rest.backdrop.color,
        },
        actionButton: {
          color: itemActionButtonVars.typeImage.rest.label.color,

          ...onlyIcon({
            color: itemActionButtonVars.typeImage.rest.icon.color,
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

      gap: vars.base.rest.root.gap,

      marginInline: "calc(var(--seed-attachment-input-extend-x) * -1)",
    },
    dropzone: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      height: dropzoneVars.base.rest.root.height,
      gap: dropzoneVars.base.rest.root.gap,

      border: `${dropzoneVars.base.rest.root.strokeWidth} dashed ${dropzoneVars.base.rest.root.strokeColor}`,
      borderRadius: dropzoneVars.base.rest.root.cornerRadius,

      paddingInline: dropzoneVars.base.rest.root.paddingX,

      // counteract root's negative margin so the dropzone stays within the original bounds
      marginInline: "var(--seed-attachment-input-extend-x)",

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
      color: dropzoneVars.base.rest.label.color,

      fontSize: dropzoneVars.base.rest.label.fontSize,
      lineHeight: dropzoneVars.base.rest.label.lineHeight,
      fontWeight: dropzoneVars.base.rest.label.fontWeight,

      textAlign: "center",

      [pseudo(disabled)]: {
        color: dropzoneVars.base.disabled.label.color,
      },
    },
    // wraps the trigger and the file items
    container: {
      display: "flex",
      gap: vars.base.rest.items.gap,

      // makes the container scrollable when there are many files
      overflowX: "auto",

      // keeps the icon removeButton's top from being cut off
      paddingTop: itemRemoveButtonVars.base.rest.root.offset,
      marginTop: `calc(${itemRemoveButtonVars.base.rest.root.offset} * -1)`,

      paddingInline: "var(--seed-attachment-input-extend-x)",
    },
    // wraps the file items
    itemGroup: {
      display: "flex",
      gap: vars.base.rest.items.gap,

      listStyle: "none",
      padding: 0,
      margin: 0,
    },
  },
  variants: {},
  defaultVariants: {},
});

export { attachmentInput, attachmentInputTrigger, attachmentInputItem };
