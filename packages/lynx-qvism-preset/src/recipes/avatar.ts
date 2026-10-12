import { avatarBadgeClipPaths } from "../utils/avatar-badge-clip-paths";
import { avatar as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

// A transparent gradient creates an Android Drawable so beforeDraw applies
// clip-path even when the view has no visible background. Keep the full path
// for `none` too, so toggling a cutout does not remove the clipping layer.
const maskBase = {
  backgroundImage: "linear-gradient(transparent, transparent)",
  clipPath: "var(--avatar-badge-clip-none)",
  overflow: "hidden",
} as const;

const maskedSlots = (shape: "circle" | "flower" | "shield") => {
  const mask = { clipPath: `var(--avatar-badge-clip-${shape})` } as const;
  return { imageContainer: mask, fallback: mask, stroke: mask };
};

export default defineSlotRecipe({
  name: "avatar",
  slots: [
    "root",
    "imageContainer",
    "pendingImageContainer",
    "image",
    "pendingImage",
    "fallback",
    "badge",
    "stroke",
  ],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    imageContainer: { ...maskBase, width: "100%", height: "100%" },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: vars.base.enabled.root.cornerRadius,
      overflow: "hidden",
    },
    pendingImageContainer: { pointerEvents: "none" },
    pendingImage: { opacity: 0, pointerEvents: "none" },
    fallback: {
      ...maskBase,
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
      ...maskBase,
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
    badgeMask: {
      none: {},
      circle: { ...maskedSlots("circle"), badge: { borderRadius: "9999px" } },
      flower: maskedSlots("flower"),
      shield: maskedSlots("shield"),
    },
    size: {
      20: {
        root: {
          width: vars.size20.enabled.root.size,
          height: vars.size20.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[20].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[20].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[20].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[20].shield,
        },
        stroke: {
          boxShadow: `inset 0 0 0 ${vars.size20.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
        },
        badge: { display: "none" },
      },
      24: {
        root: {
          width: vars.size24.enabled.root.size,
          height: vars.size24.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[24].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[24].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[24].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[24].shield,
        },
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
        root: {
          width: vars.size36.enabled.root.size,
          height: vars.size36.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[36].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[36].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[36].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[36].shield,
        },
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
        root: {
          width: vars.size42.enabled.root.size,
          height: vars.size42.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[42].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[42].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[42].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[42].shield,
        },
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
        root: {
          width: vars.size48.enabled.root.size,
          height: vars.size48.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[48].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[48].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[48].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[48].shield,
        },
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
        root: {
          width: vars.size56.enabled.root.size,
          height: vars.size56.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[56].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[56].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[56].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[56].shield,
        },
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
        root: {
          width: vars.size64.enabled.root.size,
          height: vars.size64.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[64].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[64].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[64].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[64].shield,
        },
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
        root: {
          width: vars.size80.enabled.root.size,
          height: vars.size80.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[80].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[80].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[80].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[80].shield,
        },
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
        root: {
          width: vars.size96.enabled.root.size,
          height: vars.size96.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[96].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[96].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[96].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[96].shield,
        },
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
        root: {
          width: vars.size108.enabled.root.size,
          height: vars.size108.enabled.root.size,
          "--avatar-badge-clip-none": avatarBadgeClipPaths[108].none,
          "--avatar-badge-clip-circle": avatarBadgeClipPaths[108].circle,
          "--avatar-badge-clip-flower": avatarBadgeClipPaths[108].flower,
          "--avatar-badge-clip-shield": avatarBadgeClipPaths[108].shield,
        },
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
  defaultVariants: { size: 48, badgeMask: "none" },
});
