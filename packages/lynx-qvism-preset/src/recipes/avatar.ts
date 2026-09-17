import { avatar as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

export default defineSlotRecipe({
  name: "avatar",
  slots: ["root", "image", "pendingImage", "fallback", "badge", "stroke"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: vars.base.enabled.root.cornerRadius,
      overflow: "hidden",
    },
    pendingImage: { opacity: 0, pointerEvents: "none" },
    fallback: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: vars.base.enabled.root.cornerRadius,
      overflow: "hidden",
    },
    stroke: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: vars.base.enabled.root.cornerRadius,
      pointerEvents: "none",
    },
    badge: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  variants: {
    size: {
      20: {
        root: { width: vars.size20.enabled.root.size, height: vars.size20.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size20.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: { display: "none" },
      },
      24: {
        root: { width: vars.size24.enabled.root.size, height: vars.size24.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size24.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size24.enabled.badge.size,
          height: vars.size24.enabled.badge.size,
          top: vars.size24.enabled.badge.offset,
          left: vars.size24.enabled.badge.offset,
        },
      },
      36: {
        root: { width: vars.size36.enabled.root.size, height: vars.size36.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size36.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size36.enabled.badge.size,
          height: vars.size36.enabled.badge.size,
          top: vars.size36.enabled.badge.offset,
          left: vars.size36.enabled.badge.offset,
        },
      },
      42: {
        root: { width: vars.size42.enabled.root.size, height: vars.size42.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size42.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size42.enabled.badge.size,
          height: vars.size42.enabled.badge.size,
          top: vars.size42.enabled.badge.offset,
          left: vars.size42.enabled.badge.offset,
        },
      },
      48: {
        root: { width: vars.size48.enabled.root.size, height: vars.size48.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size48.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size48.enabled.badge.size,
          height: vars.size48.enabled.badge.size,
          top: vars.size48.enabled.badge.offset,
          left: vars.size48.enabled.badge.offset,
        },
      },
      56: {
        root: { width: vars.size56.enabled.root.size, height: vars.size56.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size56.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size56.enabled.badge.size,
          height: vars.size56.enabled.badge.size,
          top: vars.size56.enabled.badge.offset,
          left: vars.size56.enabled.badge.offset,
        },
      },
      64: {
        root: { width: vars.size64.enabled.root.size, height: vars.size64.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size64.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size64.enabled.badge.size,
          height: vars.size64.enabled.badge.size,
          top: vars.size64.enabled.badge.offset,
          left: vars.size64.enabled.badge.offset,
        },
      },
      80: {
        root: { width: vars.size80.enabled.root.size, height: vars.size80.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size80.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size80.enabled.badge.size,
          height: vars.size80.enabled.badge.size,
          top: vars.size80.enabled.badge.offset,
          left: vars.size80.enabled.badge.offset,
        },
      },
      96: {
        root: { width: vars.size96.enabled.root.size, height: vars.size96.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size96.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size96.enabled.badge.size,
          height: vars.size96.enabled.badge.size,
          top: vars.size96.enabled.badge.offset,
          left: vars.size96.enabled.badge.offset,
        },
      },
      108: {
        root: { width: vars.size108.enabled.root.size, height: vars.size108.enabled.root.size },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size108.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: {
          width: vars.size108.enabled.badge.size,
          height: vars.size108.enabled.badge.size,
          top: vars.size108.enabled.badge.offset,
          left: vars.size108.enabled.badge.offset,
        },
      },
    },
  },
  defaultVariants: { size: 48 },
});
