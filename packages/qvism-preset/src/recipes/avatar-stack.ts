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
      borderRadius: vars.base.rest.item.cornerRadius,
      backgroundClip: "padding-box",
    },
  },
  variants: {
    size: {
      20: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size20.rest.root.gap,
          },
          clipPath: `inset(-${vars.size20.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size20.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      24: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size24.rest.root.gap,
          },
          clipPath: `inset(-${vars.size24.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size24.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      36: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size36.rest.root.gap,
          },
          clipPath: `inset(-${vars.size36.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size36.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      42: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size42.rest.root.gap,
          },
          clipPath: `inset(-${vars.size42.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size42.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      48: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size48.rest.root.gap,
          },
          clipPath: `inset(-${vars.size48.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size48.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      56: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size56.rest.root.gap,
          },
          clipPath: `inset(-${vars.size56.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size56.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      64: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size64.rest.root.gap,
          },
          clipPath: `inset(-${vars.size64.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size64.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      80: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size80.rest.root.gap,
          },
          clipPath: `inset(-${vars.size80.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size80.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      96: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size96.rest.root.gap,
          },
          clipPath: `inset(-${vars.size96.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size96.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
      108: {
        item: {
          [pseudo(not(":first-child"))]: {
            marginLeft: vars.size108.rest.root.gap,
          },
          clipPath: `inset(-${vars.size108.rest.item.strokeWidth})`,
          boxShadow: `0 0 0 ${vars.size108.rest.item.strokeWidth} ${vars.base.rest.item.strokeColor}`,
        },
      },
    },
  },
  defaultVariants: {
    size: 48,
  },
});

export default avatarStack;
