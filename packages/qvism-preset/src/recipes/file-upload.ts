import { defineSlotRecipe } from "../utils/define";
import { disabled, pseudo } from "../utils/pseudo";
import { vars } from "../vars";

/**
 * FileUpload - 64×64 Thumbnail Grid Style
 * Based on karrot-form MediaInput design
 */
const fileUpload = defineSlotRecipe({
  name: "file-upload",
  slots: [
    "root",
    "dropzone",
    "container",
    "trigger",
    "itemGroup",
    "item",
    "itemPreview",
    "itemImage",
    "itemName",
    "itemSize",
    "itemDeleteTrigger",
    "clearTrigger",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: vars.$dimension.x3,
      width: "100%",
    },
    dropzone: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.$dimension.x2,
      padding: vars.$dimension.x4,
      border: `1px dashed ${vars.$color.stroke.neutralMuted}`,
      borderRadius: vars.$radius.r2,
      backgroundColor: vars.$color.bg.layerDefault,
      cursor: "pointer",
      transition: "border-color 0.2s, background-color 0.2s",

      "&:hover, &[data-dragging]": {
        borderColor: vars.$color.stroke.brandSolid,
        backgroundColor: vars.$color.bg.layerDefaultPressed,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
      gap: vars.$dimension.x2,
      alignItems: "flex-start",
    },
    trigger: {
      // 64×64 upload button style (MediaInput button)
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "64px",
      height: "64px",
      padding: vars.$dimension.x2,
      cursor: "pointer",
      backgroundColor: vars.$color.bg.layerDefault,
      border: `1px solid ${vars.$color.stroke.neutralSolid}`,
      borderRadius: vars.$radius.r2,
      transition: "all 0.2s ease",

      "&:hover": {
        borderColor: vars.$color.palette.gray600,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
    itemGroup: {
      // flex-wrap grid layout
      display: "flex",
      flexWrap: "wrap",
      gap: vars.$dimension.x2,
      padding: 0,
      margin: 0,
      listStyle: "none",
    },
    item: {
      // 64×64 relative container
      position: "relative",
      width: "64px",
      height: "64px",
    },
    itemPreview: {
      // Preview wrapper with border and background
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: vars.$color.bg.layerDefault,
      border: `1px solid ${vars.$color.stroke.neutralSolid}`,
      borderRadius: vars.$radius.r2,
      overflow: "hidden",
    },
    itemImage: {
      // Image thumbnail with object-fit: cover
      width: "100%",
      height: "100%",
      borderRadius: vars.$radius.r2,
      objectFit: "cover",
    },
    itemName: {
      // 10px, 2-line ellipsis
      display: "-webkit-box",
      width: "100%",
      overflow: "hidden",
      fontSize: "10px",
      lineHeight: "10px",
      color: vars.$color.fg.neutralSubtle,
      textAlign: "center",
      textOverflow: "ellipsis",
      wordBreak: "break-all",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
    },
    itemSize: {
      // 9px file size
      fontSize: "9px",
      lineHeight: "11px",
      color: vars.$color.fg.neutralSubtle,
      textAlign: "center",
    },
    itemDeleteTrigger: {
      // 16×16 circular delete button (top-right, protruding)
      position: "absolute",
      top: "-6px",
      right: "-6px",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      padding: 0,
      cursor: "pointer",
      backgroundColor: vars.$color.palette.gray1000,
      border: "none",
      borderRadius: "50%",
      color: vars.$color.palette.staticWhite,
      transition: "all 0.2s ease",

      "&:hover": {
        opacity: 0.8,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
    clearTrigger: {
      alignSelf: "flex-start",
      padding: `${vars.$dimension.x1} ${vars.$dimension.x2}`,
      border: "none",
      borderRadius: vars.$radius.r1,
      backgroundColor: "transparent",
      color: vars.$color.fg.neutralSubtle,
      fontSize: vars.$fontSize.t3,
      cursor: "pointer",
      transition: "background-color 0.2s",

      "&:hover": {
        backgroundColor: vars.$color.bg.neutralWeakPressed,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default fileUpload;
