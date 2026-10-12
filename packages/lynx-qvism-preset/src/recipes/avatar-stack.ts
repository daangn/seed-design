import { avatarStack as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

export default defineSlotRecipe({
  name: "avatar-stack",
  slots: ["root", "item", "overlap"],
  base: {
    root: { display: "flex", flexDirection: "row", alignItems: "center" },
    item: { flexShrink: 0, borderRadius: vars.base.enabled.item.cornerRadius },
  },
  variants: {
    size: {
      20: {
        item: {
          boxShadow: `0 0 0 ${vars.size20.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size20.enabled.root.gap },
      },
      24: {
        item: {
          boxShadow: `0 0 0 ${vars.size24.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size24.enabled.root.gap },
      },
      36: {
        item: {
          boxShadow: `0 0 0 ${vars.size36.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size36.enabled.root.gap },
      },
      42: {
        item: {
          boxShadow: `0 0 0 ${vars.size42.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size42.enabled.root.gap },
      },
      48: {
        item: {
          boxShadow: `0 0 0 ${vars.size48.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size48.enabled.root.gap },
      },
      56: {
        item: {
          boxShadow: `0 0 0 ${vars.size56.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size56.enabled.root.gap },
      },
      64: {
        item: {
          boxShadow: `0 0 0 ${vars.size64.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size64.enabled.root.gap },
      },
      80: {
        item: {
          boxShadow: `0 0 0 ${vars.size80.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size80.enabled.root.gap },
      },
      96: {
        item: {
          boxShadow: `0 0 0 ${vars.size96.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size96.enabled.root.gap },
      },
      108: {
        item: {
          boxShadow: `0 0 0 ${vars.size108.enabled.item.strokeWidth} ${vars.base.enabled.item.strokeColor}`,
        },
        overlap: { marginLeft: vars.size108.enabled.root.gap },
      },
    },
  },
  defaultVariants: { size: 48 },
});
