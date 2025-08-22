import { avatarStack as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { not, pseudo } from "../utils/pseudo";

const avatarStack = defineSlotRecipe({
  name: "avatar-stack",
  slots: ["root", "item"],
  base: {
    root: {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
    },
    item: {
      display: "block",
      borderRadius: vars.base.enabled.item.cornerRadius,
      backgroundClip: "padding-box",
    },
  },
  variants: {
    size: {
      20: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size20.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size20.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size20.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      24: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size24.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size24.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size24.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      36: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size36.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size36.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size36.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      42: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size42.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size42.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size42.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      48: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size48.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size48.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size48.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      64: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size64.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size64.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size64.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      80: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size80.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size80.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size80.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      96: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size96.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size96.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size96.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
      108: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size108.enabled.root.gap,
          },
          clipPath: `inset(-${vars.size108.enabled.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size108.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
      },
    },
  },
  defaultVariants: {
    size: 48,
  },
});

export default avatarStack;
