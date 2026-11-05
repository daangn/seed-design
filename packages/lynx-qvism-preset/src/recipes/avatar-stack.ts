import { avatarStack as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

export default defineSlotRecipe({
  name: "avatar-stack",
  slots: ["root", "item", "overlap"],
  base: {
    // item의 링이 root 밖으로 걸치므로 root가 자르지 않게 한다.
    root: { display: "flex", flexDirection: "row", alignItems: "center", overflow: "visible" },
    // iOS Lynx는 box-shadow를 흐리게 그린다. 링을 item의 border로 그리고 음수 margin으로
    // 기존 배치(avatar 크기)를 유지한다.
    item: {
      flexShrink: 0,
      borderStyle: "solid",
      borderColor: vars.base.enabled.item.strokeColor,
      borderRadius: vars.base.enabled.item.cornerRadius,
    },
  },
  variants: {
    size: {
      20: {
        item: {
          borderWidth: vars.size20.enabled.item.strokeWidth,
          margin: `calc(${vars.size20.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size20.enabled.root.gap} - ${vars.size20.enabled.item.strokeWidth})`,
        },
      },
      24: {
        item: {
          borderWidth: vars.size24.enabled.item.strokeWidth,
          margin: `calc(${vars.size24.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size24.enabled.root.gap} - ${vars.size24.enabled.item.strokeWidth})`,
        },
      },
      36: {
        item: {
          borderWidth: vars.size36.enabled.item.strokeWidth,
          margin: `calc(${vars.size36.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size36.enabled.root.gap} - ${vars.size36.enabled.item.strokeWidth})`,
        },
      },
      42: {
        item: {
          borderWidth: vars.size42.enabled.item.strokeWidth,
          margin: `calc(${vars.size42.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size42.enabled.root.gap} - ${vars.size42.enabled.item.strokeWidth})`,
        },
      },
      48: {
        item: {
          borderWidth: vars.size48.enabled.item.strokeWidth,
          margin: `calc(${vars.size48.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size48.enabled.root.gap} - ${vars.size48.enabled.item.strokeWidth})`,
        },
      },
      56: {
        item: {
          borderWidth: vars.size56.enabled.item.strokeWidth,
          margin: `calc(${vars.size56.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size56.enabled.root.gap} - ${vars.size56.enabled.item.strokeWidth})`,
        },
      },
      64: {
        item: {
          borderWidth: vars.size64.enabled.item.strokeWidth,
          margin: `calc(${vars.size64.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size64.enabled.root.gap} - ${vars.size64.enabled.item.strokeWidth})`,
        },
      },
      80: {
        item: {
          borderWidth: vars.size80.enabled.item.strokeWidth,
          margin: `calc(${vars.size80.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size80.enabled.root.gap} - ${vars.size80.enabled.item.strokeWidth})`,
        },
      },
      96: {
        item: {
          borderWidth: vars.size96.enabled.item.strokeWidth,
          margin: `calc(${vars.size96.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size96.enabled.root.gap} - ${vars.size96.enabled.item.strokeWidth})`,
        },
      },
      108: {
        item: {
          borderWidth: vars.size108.enabled.item.strokeWidth,
          margin: `calc(${vars.size108.enabled.item.strokeWidth} * -1)`,
        },
        overlap: {
          marginLeft: `calc(${vars.size108.enabled.root.gap} - ${vars.size108.enabled.item.strokeWidth})`,
        },
      },
    },
  },
  defaultVariants: { size: 48 },
});
