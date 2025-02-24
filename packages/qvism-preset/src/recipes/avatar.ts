import { avatar as vars } from "../vars/component";
import { defineRecipe } from "../utils/define";
import { not, pseudo } from "../utils/pseudo";

function calculateBadgePosition(avatarSize: string, badgeSize: string) {
  return {
    top: `calc(${avatarSize} / 2 + ${avatarSize} / 2.828 - ${badgeSize} / 2)`,
    left: `calc(${avatarSize} / 2 + ${avatarSize} / 2.828 - ${badgeSize} / 2)`,
  };
}

const avatar = defineRecipe({
  name: "avatar",
  slots: ["root", "image", "fallback", "badge"],
  base: {
    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "top",

      borderRadius: vars.base.enabled.root.cornerRadius,
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      overflow: "hidden",
      borderRadius: vars.base.enabled.root.cornerRadius,

      [pseudo(not("[data-loading-state='loaded']"))]: {
        display: "none",
      },
    },
    fallback: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      overflow: "hidden",
      borderRadius: vars.base.enabled.root.cornerRadius,

      [pseudo("[data-loading-state='loaded']")]: {
        display: "none",
      },
    },
    badge: {
      boxSizing: "border-box",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      background: vars.base.enabled.badge.color,
      borderRadius: vars.base.enabled.badge.cornerRadius,
    },
  },
  variants: {
    size: {
      20: {
        root: {
          width: vars.size20.enabled.root.size,
          height: vars.size20.enabled.root.size,
        },
        badge: {
          width: vars.size20.enabled.badge.size,
          height: vars.size20.enabled.badge.size,
          ...calculateBadgePosition(vars.size20.enabled.root.size, vars.size20.enabled.badge.size),
        },
      },
      24: {
        root: {
          width: vars.size24.enabled.root.size,
          height: vars.size24.enabled.root.size,
        },
        badge: {
          width: vars.size24.enabled.badge.size,
          height: vars.size24.enabled.badge.size,
          ...calculateBadgePosition(vars.size24.enabled.root.size, vars.size24.enabled.badge.size),
        },
      },
      36: {
        root: {
          width: vars.size36.enabled.root.size,
          height: vars.size36.enabled.root.size,
        },
        badge: {
          width: vars.size36.enabled.badge.size,
          height: vars.size36.enabled.badge.size,
          ...calculateBadgePosition(vars.size36.enabled.root.size, vars.size36.enabled.badge.size),
        },
      },
      48: {
        root: {
          width: vars.size48.enabled.root.size,
          height: vars.size48.enabled.root.size,
        },
        badge: {
          width: vars.size48.enabled.badge.size,
          height: vars.size48.enabled.badge.size,
          ...calculateBadgePosition(vars.size48.enabled.root.size, vars.size48.enabled.badge.size),
        },
      },
      64: {
        root: {
          width: vars.size64.enabled.root.size,
          height: vars.size64.enabled.root.size,
        },
        badge: {
          width: vars.size64.enabled.badge.size,
          height: vars.size64.enabled.badge.size,
          ...calculateBadgePosition(vars.size64.enabled.root.size, vars.size64.enabled.badge.size),
        },
      },
      80: {
        root: {
          width: vars.size80.enabled.root.size,
          height: vars.size80.enabled.root.size,
        },
        badge: {
          width: vars.size80.enabled.badge.size,
          height: vars.size80.enabled.badge.size,
          ...calculateBadgePosition(vars.size80.enabled.root.size, vars.size80.enabled.badge.size),
        },
      },
      96: {
        root: {
          width: vars.size96.enabled.root.size,
          height: vars.size96.enabled.root.size,
        },
        badge: {
          width: vars.size96.enabled.badge.size,
          height: vars.size96.enabled.badge.size,
          ...calculateBadgePosition(vars.size96.enabled.root.size, vars.size96.enabled.badge.size),
        },
      },
    },
  },
  defaultVariants: {
    size: 48,
  },
});

export default avatar;
