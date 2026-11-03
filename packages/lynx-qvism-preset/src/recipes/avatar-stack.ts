import { avatarStack as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

export default defineSlotRecipe({
  name: "avatar-stack",
  slots: ["root", "item", "overlap", "stroke"],
  base: {
    // stroke가 item 밖으로 걸치므로 root와 item이 자르지 않게 한다.
    root: { display: "flex", flexDirection: "row", alignItems: "center", overflow: "visible" },
    item: {
      position: "relative",
      flexShrink: 0,
      borderRadius: vars.base.enabled.item.cornerRadius,
      overflow: "visible",
    },
    // iOS Lynx는 box-shadow를 흐리게 그린다. item 바깥 링을 음수 offset overlay의 border로 그린다.
    stroke: {
      position: "absolute",
      borderStyle: "solid",
      borderColor: vars.base.enabled.item.strokeColor,
      borderRadius: vars.base.enabled.item.cornerRadius,
      pointerEvents: "none",
    },
  },
  variants: {
    size: {
      20: {
        stroke: {
          top: `calc(${vars.size20.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size20.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size20.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size20.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size20.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size20.enabled.root.gap },
      },
      24: {
        stroke: {
          top: `calc(${vars.size24.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size24.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size24.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size24.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size24.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size24.enabled.root.gap },
      },
      36: {
        stroke: {
          top: `calc(${vars.size36.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size36.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size36.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size36.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size36.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size36.enabled.root.gap },
      },
      42: {
        stroke: {
          top: `calc(${vars.size42.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size42.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size42.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size42.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size42.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size42.enabled.root.gap },
      },
      48: {
        stroke: {
          top: `calc(${vars.size48.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size48.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size48.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size48.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size48.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size48.enabled.root.gap },
      },
      56: {
        stroke: {
          top: `calc(${vars.size56.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size56.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size56.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size56.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size56.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size56.enabled.root.gap },
      },
      64: {
        stroke: {
          top: `calc(${vars.size64.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size64.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size64.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size64.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size64.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size64.enabled.root.gap },
      },
      80: {
        stroke: {
          top: `calc(${vars.size80.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size80.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size80.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size80.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size80.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size80.enabled.root.gap },
      },
      96: {
        stroke: {
          top: `calc(${vars.size96.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size96.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size96.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size96.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size96.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size96.enabled.root.gap },
      },
      108: {
        stroke: {
          top: `calc(${vars.size108.enabled.item.strokeWidth} * -1)`,
          right: `calc(${vars.size108.enabled.item.strokeWidth} * -1)`,
          bottom: `calc(${vars.size108.enabled.item.strokeWidth} * -1)`,
          left: `calc(${vars.size108.enabled.item.strokeWidth} * -1)`,
          borderWidth: vars.size108.enabled.item.strokeWidth,
        },
        overlap: { marginLeft: vars.size108.enabled.root.gap },
      },
    },
  },
  defaultVariants: { size: 48 },
});
