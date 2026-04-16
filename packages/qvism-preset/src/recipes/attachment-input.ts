import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { engaged, disabled, focusVisible, not, pseudo } from "../utils/pseudo";
import {
  attachmentInput as vars,
  attachmentInputItem as itemVars,
  attachmentInputItemRemoveButton as removeButtonVars,
  attachmentInputTrigger as triggerVars,
  attachmentInputDropzone as dropzoneVars,
} from "../vars/component";
import { vars as tokens } from "../vars";

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

      transition: "opacity 0.2s",

      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",

        pointerEvents: "none",
      },

      [pseudo("[role='button']", not("[aria-grabbed=true]"))]: {
        cursor: "grab",
      },

      [pseudo("[aria-grabbed=true]")]: {
        opacity: 0.5,
      },
    },
    image: {
      width: "100%",
      height: "100%",

      objectFit: "cover",

      borderRadius: "inherit",
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
      gap: "2px",
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

      fontSize: itemVars.base.enabled.actionButtonLabel.fontSize,
      lineHeight: itemVars.base.enabled.actionButtonLabel.lineHeight,
      fontWeight: itemVars.base.enabled.actionButtonLabel.fontWeight,

      gap: itemVars.base.enabled.actionButton.gap,

      ...onlyIcon({
        size: itemVars.base.enabled.actionButtonIcon.size,
      }),
    },
    removeButton: {
      position: "absolute",
      top: `calc(${removeButtonVars.base.enabled.root.offset} * -1)`,
      right: `calc(${removeButtonVars.base.enabled.root.offset} * -1)`,

      width: removeButtonVars.base.enabled.root.size,
      height: removeButtonVars.base.enabled.root.size,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      padding: 0,
      backgroundColor: removeButtonVars.base.enabled.root.color,
      borderRadius: removeButtonVars.base.enabled.root.cornerRadius,
      cursor: "pointer",
      transition: `background-color 0.2s, ${FOCUS_RING_TRANSITION}`,

      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      boxShadow: `inset 0 0 0 ${removeButtonVars.base.enabled.root.strokeWidth} ${removeButtonVars.base.enabled.root.strokeColor}, 0 0 0 ${removeButtonVars.base.enabled.root.foobarWidth} ${removeButtonVars.base.enabled.root.foobarColor}`,

      ...onlyIcon({
        size: removeButtonVars.base.enabled.icon.size,
        color: removeButtonVars.base.enabled.icon.color,
      }),

      [pseudo(engaged)]: {
        backgroundColor: removeButtonVars.base.pressed.root.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        ...onlyIcon({
          color: removeButtonVars.base.disabled.icon.color,
        }),
      },
    },
  },
  variants: {
    type: {
      // TODO: rename
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
        },
        metadata: {
          [pseudo("[data-has-overlay]")]: {
            display: "none",
          },
        },
        actionButton: {
          color: itemVars.typeFile.enabled.actionButtonLabel.color,

          ...onlyIcon({
            color: itemVars.typeFile.enabled.actionButtonLabel.color,
          }),
        },
      },
      image: {
        root: {
          width: itemVars.typeImage.enabled.root.width,

          "&::before": {
            boxShadow: `inset 0 0 0 ${itemVars.base.enabled.root.strokeWidth} ${itemVars.typeImage.enabled.root.strokeColor}`,
          },
        },
        thumbnail: {
          display: "none",
        },
        metadata: {
          display: "none",
        },
        backdrop: {
          background: itemVars.typeImage.enabled.backdrop.color,
        },
        actionButton: {
          color: itemVars.typeImage.enabled.actionButtonLabel.color,

          ...onlyIcon({
            color: itemVars.typeImage.enabled.actionButtonLabel.color,
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

      // define in rootage
      paddingLeft: "8px",
      paddingRight: "8px",

      transition: "border-color 0.2s",

      [pseudo("[data-dragging-over]")]: {
        borderStyle: "solid",
        borderColor: tokens.$color.stroke.neutralSolid,
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
      paddingTop: removeButtonVars.base.enabled.root.offset,
      marginTop: `calc(${removeButtonVars.base.enabled.root.offset} * -1)`,

      paddingLeft: "var(--seed-attachment-input-extend-x)",
      paddingRight: "var(--seed-attachment-input-extend-x)",
    },
    // wraps the file items
    itemGroup: {
      display: "flex",
      gap: vars.base.enabled.items.gap,

      // ul styles << needed? // TODO
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
  },
  variants: {},
  defaultVariants: {},
});

export { attachmentInput, attachmentInputTrigger, attachmentInputItem };
