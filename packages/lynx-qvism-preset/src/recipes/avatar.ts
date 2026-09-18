import { avatarBadgeMasks } from "../utils/avatar-badge-masks";
import { avatar as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const maskedSlots = (shape: "circle" | "flower" | "shield") => {
  const mask = {
    maskImage: `var(--avatar-badge-mask-${shape})`,
    maskSize: "100% 100%",
    maskPosition: "0px 0px",
    maskRepeat: "no-repeat",
  } as const;
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
    imageContainer: { width: "100%", height: "100%" },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: vars.base.enabled.root.cornerRadius,
      overflow: "hidden",
    },
    pendingImageContainer: { pointerEvents: "none" },
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
          "--avatar-badge-mask-circle": "linear-gradient(#000, #000)",
          "--avatar-badge-mask-flower": "linear-gradient(#000, #000)",
          "--avatar-badge-mask-shield": "linear-gradient(#000, #000)",
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[24].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[24].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[24].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[36].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[36].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[36].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[42].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[42].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[42].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[48].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[48].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[48].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[56].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[56].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[56].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[64].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[64].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[64].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[80].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[80].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[80].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[96].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[96].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[96].shield,
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
          "--avatar-badge-mask-circle": avatarBadgeMasks[108].circle,
          "--avatar-badge-mask-flower": avatarBadgeMasks[108].flower,
          "--avatar-badge-mask-shield": avatarBadgeMasks[108].shield,
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
