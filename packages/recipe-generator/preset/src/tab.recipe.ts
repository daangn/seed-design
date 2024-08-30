import { vars } from "./__generated__/tab.vars";
import { defineRecipe } from "./helper";
import { disabled, pseudo, selected } from "./pseudo";

const tab = defineRecipe({
  name: "tab",
  slots: ["root", "label", "notification"],
  base: {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      cursor: "pointer",
      border: "none",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    label: {
      position: "relative",
      color: vars.base.enabled.label.color,
      [pseudo(selected)]: {
        color: vars.base.selected.label.color,
      },
      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
    notification: {
      position: "absolute",
      top: 0,

      /**
       * notification이 Tabs의 박스 사이즈에 잡히지 않도록 하기 위한 트릭
       * notification의 위치를 absolute로 잡아주고, right를 음수로 설정하여 박스 밖으로 나가게 함
       * 이때, 텍스트에서 marginLeft만큼 떨어진 위치에 위치해야하기 위해서는
       * 우선 notification의 size만큼 오른쪽으로 한번 이동하고 거기서 marginLeft만큼 오른쪽으로 이동해야함
       * 그래서 아래와 같은 식이 나옴
       */
      right: `calc(-1 * ${vars.base.enabled.notification.size} - ${vars.base.enabled.notification.marginLeft})`,

      alignSelf: "flex-start",
      backgroundColor: vars.base.enabled.notification.color,
      width: vars.base.enabled.notification.size,
      height: vars.base.enabled.notification.size,
      borderRadius: vars.base.enabled.notification.cornerRadius,
    },
  },
  variants: {
    layout: {
      fill: {
        root: {
          flex: 1,
        },
      },
      hug: {},
    },
    size: {
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
          paddingBlock: vars.sizeMedium.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          fontWeight: vars.sizeMedium.enabled.label.fontWeight,
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.minHeight,
          paddingInline: vars.sizeSmall.enabled.root.paddingX,
          paddingBlock: vars.sizeSmall.enabled.root.paddingY,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          fontWeight: vars.sizeSmall.enabled.label.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
    layout: "hug",
  },
});

export default tab;
