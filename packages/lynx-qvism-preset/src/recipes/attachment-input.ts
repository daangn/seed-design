import { attachmentInput as vars } from "../vars/component";
import { attachmentInputItem as itemVars } from "../vars/component";
import { attachmentInputItemActionButton as itemActionButtonVars } from "../vars/component";
import { attachmentInputItemRemoveButton as itemRemoveButtonVars } from "../vars/component";
import { attachmentInputTrigger as triggerVars } from "../vars/component";
import * as duration from "../vars/duration";
import * as scale from "../vars/scale";
import * as timingFunction from "../vars/timing-function";
import { defineSlotRecipe } from "../utils/define";

const PRESS_TRANSITION = `transform ${duration.pressedScale} ${timingFunction.pressedScale}`;

/**
 * The host owns file selection and drag state on Lynx. The browser-only
 * dropzone is intentionally not represented by this recipe.
 */
const attachmentInput = defineSlotRecipe({
  name: "attachment-input",
  slots: ["root", "container", "containerContent", "itemGroup"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.enabled.root.gap,
      position: "relative",
      marginLeft: "calc(var(--seed-attachment-input-extend-x) * -1)",
      marginRight: "calc(var(--seed-attachment-input-extend-x) * -1)",
    },
    container: {
      paddingTop: itemVars.base.enabled.removeButtonMask.offset,
      marginTop: `calc(${itemVars.base.enabled.removeButtonMask.offset} * -1)`,
      paddingLeft: "var(--seed-attachment-input-extend-x)",
      paddingRight: "var(--seed-attachment-input-extend-x)",
    },
    containerContent: {
      display: "flex",
      flexDirection: "row",
      gap: vars.base.enabled.items.gap,
      width: "max-content",
      minWidth: "100%",
      flexShrink: 0,
    },
    itemGroup: {
      display: "flex",
      flexDirection: "row",
      width: "max-content",
      gap: vars.base.enabled.items.gap,
      flexShrink: 0,
      padding: 0,
      margin: 0,
    },
  },
  variants: {},
  defaultVariants: {},
});

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
      borderRadius: triggerVars.base.enabled.root.cornerRadius,
      boxShadow: `inset 0 0 0 ${triggerVars.base.enabled.root.strokeWidth} ${triggerVars.base.enabled.root.strokeColor}`,
      padding: 0,
      backgroundColor: "transparent",
      transition: "background-color 0.2s",
    },
    icon: {
      width: triggerVars.base.enabled.icon.size,
      height: triggerVars.base.enabled.icon.size,
      color: triggerVars.base.enabled.icon.color,
      flexShrink: 0,
    },
    itemCountArea: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      fontSize: triggerVars.base.enabled.itemCount.fontSize,
      lineHeight: triggerVars.base.enabled.itemCount.lineHeight,
    },
    itemCount: {
      color: triggerVars.base.enabled.itemCount.color,
      fontSize: triggerVars.base.enabled.itemCount.fontSize,
      lineHeight: triggerVars.base.enabled.itemCount.lineHeight,
      fontWeight: triggerVars.base.enabled.itemCount.fontWeight,
    },
    maxItemCount: {
      color: triggerVars.base.enabled.maxItemCount.color,
      fontSize: triggerVars.base.enabled.maxItemCount.fontSize,
      lineHeight: triggerVars.base.enabled.maxItemCount.lineHeight,
      fontWeight: triggerVars.base.enabled.maxItemCount.fontWeight,
    },
  },
  variants: {
    pressed: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        icon: { color: triggerVars.base.disabled.icon.color },
        itemCount: { color: triggerVars.base.disabled.itemCount.color },
        maxItemCount: { color: triggerVars.base.disabled.maxItemCount.color },
      },
      false: {
        root: { "&:active": { backgroundColor: triggerVars.base.pressed.root.color } },
      },
    },
  },
  compoundVariants: [
    {
      disabled: false,
      pressed: true,
      css: { root: { backgroundColor: triggerVars.base.pressed.root.color } },
    },
  ],
  defaultVariants: {
    pressed: false,
    disabled: false,
  },
});

const attachmentInputItem = defineSlotRecipe({
  name: "attachment-input-item",
  slots: [
    "root",
    "surface",
    "image",
    "thumbnail",
    "thumbnailIcon",
    "metadata",
    "name",
    "size",
    "badge",
    "badgeLabel",
    "backdrop",
    "actionButton",
    "actionIcon",
    "actionLabel",
    "removeButton",
    "removeIcon",
  ],
  base: {
    root: {
      position: "relative",
      display: "flex",
      width: "100%",
      height: itemVars.base.enabled.root.height,
      borderRadius: itemVars.base.enabled.root.cornerRadius,
      backgroundColor: "transparent",
      transform: "scale(1)",
      transition: PRESS_TRANSITION,
      overflow: "visible",
    },
    surface: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: itemVars.base.enabled.root.gap,
      borderRadius: itemVars.base.enabled.root.cornerRadius,
      backgroundColor: itemVars.base.enabled.root.color,
      pointerEvents: "auto",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: itemVars.base.enabled.root.cornerRadius,
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
      color: itemVars.base.enabled.thumbnailIcon.color,
    },
    thumbnailIcon: {
      width: itemVars.base.enabled.thumbnailIcon.size,
      height: itemVars.base.enabled.thumbnailIcon.size,
      flexShrink: 0,
      color: itemVars.base.enabled.thumbnailIcon.color,
    },
    metadata: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minWidth: 0,
      flexGrow: 1,
    },
    name: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
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
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: itemVars.base.enabled.root.cornerRadius,
    },
    actionButton: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      borderWidth: 0,
      padding: 0,
      backgroundColor: "transparent",
      borderRadius: itemVars.base.enabled.root.cornerRadius,
      color: itemActionButtonVars.typeFile.enabled.label.color,
      gap: itemActionButtonVars.base.enabled.root.gap,
      transition: PRESS_TRANSITION,
    },
    actionIcon: {
      width: itemActionButtonVars.base.enabled.icon.size,
      height: itemActionButtonVars.base.enabled.icon.size,
      flexShrink: 0,
      color: itemActionButtonVars.typeFile.enabled.icon.color,
    },
    actionLabel: {
      fontSize: itemActionButtonVars.base.enabled.label.fontSize,
      lineHeight: itemActionButtonVars.base.enabled.label.lineHeight,
      fontWeight: itemActionButtonVars.base.enabled.label.fontWeight,
      color: itemActionButtonVars.typeFile.enabled.label.color,
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
      borderWidth: 0,
      padding: 0,
      backgroundColor: itemRemoveButtonVars.base.enabled.root.color,
      borderRadius: itemRemoveButtonVars.base.enabled.root.cornerRadius,
      boxShadow: `inset 0 0 0 ${itemRemoveButtonVars.base.enabled.root.strokeWidth} ${itemRemoveButtonVars.base.enabled.root.strokeColor}`,
      color: itemRemoveButtonVars.base.enabled.icon.color,
      transition: "background-color 0.2s",
    },
    removeIcon: {
      width: itemRemoveButtonVars.base.enabled.icon.size,
      height: itemRemoveButtonVars.base.enabled.icon.size,
      flexShrink: 0,
      color: itemRemoveButtonVars.base.enabled.icon.color,
    },
    badge: {},
    badgeLabel: {},
  },
  variants: {
    type: {
      general: {
        root: {
          width: itemVars.typeFile.enabled.root.width,
        },
        surface: {
          paddingLeft: itemVars.typeFile.enabled.root.paddingX,
          paddingRight: itemVars.typeFile.enabled.root.paddingX,
          boxShadow: `inset 0 0 0 ${itemVars.base.enabled.root.strokeWidth} ${itemVars.typeFile.enabled.root.strokeColor}`,
          // The minor arc keeps the cutout centered on the remove button.
          clipPath: 'path("M0 0 H143.607695 A12 12 0 0 0 160 16.392305 V80 H0 Z")',
        },
        thumbnail: {
          color: itemVars.base.enabled.thumbnailIcon.color,
        },
        metadata: {},
        actionButton: {
          color: itemActionButtonVars.typeFile.enabled.label.color,
        },
        actionIcon: {
          color: itemActionButtonVars.typeFile.enabled.icon.color,
        },
        actionLabel: {
          color: itemActionButtonVars.typeFile.enabled.label.color,
        },
      },
      image: {
        root: {
          width: itemVars.typeImage.enabled.root.width,
          transition: `opacity ${duration.colorTransition}, ${PRESS_TRANSITION}`,
        },
        surface: {
          boxShadow: `inset 0 0 0 ${itemVars.base.enabled.root.strokeWidth} ${itemVars.typeImage.enabled.root.strokeColor}`,
          clipPath: 'path("M0 0 H63.607695 A12 12 0 0 0 80 16.392305 V80 H0 Z")',
        },
        thumbnail: { display: "none" },
        metadata: { display: "none" },
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
          backgroundColor: itemVars.typeImage.enabled.backdrop.color,
        },
        actionButton: {
          color: itemActionButtonVars.typeImage.enabled.label.color,
        },
        actionIcon: {
          color: itemActionButtonVars.typeImage.enabled.icon.color,
        },
        actionLabel: {
          color: itemActionButtonVars.typeImage.enabled.label.color,
        },
      },
    },
    removePressed: {
      true: {},
      false: {},
    },
    pressed: {
      true: {
        root: { transform: `scale(${scale.s98})` },
      },
      false: {},
    },
    readOnly: {
      true: {
        thumbnail: { color: itemVars.typeFile.readonly.thumbnailIcon.color },
        thumbnailIcon: { color: itemVars.typeFile.readonly.thumbnailIcon.color },
        name: { color: itemVars.typeFile.readonly.name.color },
        size: { color: itemVars.typeFile.readonly.size.color },
      },
      false: {},
    },
    dragging: {
      true: {
        root: { transform: `scale(${scale.s98})` },
        thumbnail: { color: itemVars.typeFile.dragging.thumbnailIcon.color },
        thumbnailIcon: { color: itemVars.typeFile.dragging.thumbnailIcon.color },
        name: { color: itemVars.typeFile.dragging.name.color },
        size: { color: itemVars.typeFile.dragging.size.color },
        surface: { clipPath: "inset(0px)" },
        removeButton: { display: "none" },
      },
      false: {},
    },
    disabled: {
      true: {
        thumbnail: { color: itemVars.typeFile.readonly.thumbnailIcon.color },
        thumbnailIcon: { color: itemVars.typeFile.readonly.thumbnailIcon.color },
        name: { color: itemVars.typeFile.readonly.name.color },
        size: { color: itemVars.typeFile.readonly.size.color },
        actionButton: { color: itemVars.typeFile.readonly.name.color },
        actionIcon: { color: itemVars.typeFile.readonly.thumbnailIcon.color },
        actionLabel: { color: itemVars.typeFile.readonly.name.color },
        removeButton: { color: itemRemoveButtonVars.base.disabled.icon.color },
        removeIcon: { color: itemRemoveButtonVars.base.disabled.icon.color },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      disabled: false,
      readOnly: false,
      css: {
        removeButton: {
          "&:active": { backgroundColor: itemRemoveButtonVars.base.pressed.root.color },
        },
      },
    },
    {
      disabled: false,
      readOnly: false,
      removePressed: true,
      css: {
        removeButton: { backgroundColor: itemRemoveButtonVars.base.pressed.root.color },
      },
    },
    {
      type: "image",
      readOnly: true,
      css: {
        root: { opacity: itemVars.typeImage.readonly.root.opacity },
      },
    },
    {
      type: "image",
      dragging: true,
      css: {
        root: { opacity: itemVars.typeImage.dragging.root.opacity },
      },
    },
  ],
  defaultVariants: {
    type: "general",
    removePressed: false,
    pressed: false,
    readOnly: false,
    dragging: false,
    disabled: false,
  },
});

export { attachmentInput, attachmentInputTrigger, attachmentInputItem };
