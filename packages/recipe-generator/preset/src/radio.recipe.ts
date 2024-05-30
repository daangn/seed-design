import { vars } from "./__generated__/radio.vars";
import { defineRecipe } from "./helper";
import { checked, disabled, pressed, pseudo } from "./pseudo";

const radio = defineRecipe({
  name: "radio",
  slots: ["root", "control", "icon", "label"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "flex-start",
      position: "relative",
      maxInlineSize: "100%",
      verticalAlign: "top",
      isolation: "isolate",
      cursor: "pointer",
    },
    control: {
      position: "relative",
      boxSizing: "border-box",
      borderRadius: vars.base.enabled.control.borderRadius,

      background: vars.base.enabled.control.background,
      borderWidth: vars.base.enabled.control.borderWidth,
      borderStyle: "solid",
      borderColor: vars.base.enabled.control.borderColor,

      [pseudo(checked)]: {
        background: vars.base.enabledSelected.control.background,
        borderWidth: vars.base.enabledSelected.control.borderWidth,
      },
      [pseudo(pressed)]: {
        background: vars.base.pressed.control.background,
      },
      [pseudo(pressed, checked)]: {
        background: vars.base.pressedSelected.control.background,
      },
      [pseudo(disabled)]: {
        background: vars.base.disabled.control.background,
      },
      [pseudo(disabled, checked)]: {
        background: vars.base.disabledSelected.control.background,
      },
    },
    icon: {
      display: "none",
      content: '""',
      position: "absolute",
      borderRadius: "100%",
      margin: "auto",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      textAlign: "center",

      [pseudo(checked)]: {
        display: "block",
        background: vars.base.enabledSelected.icon.background,
      },
      [pseudo(disabled, checked)]: {
        display: "block",
        background: vars.base.disabledSelected.icon.background,
      },
    },
    label: {
      color: vars.base.enabled.label.color,
      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
  },
  variants: {
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          gap: vars.sizeLarge.enabled.root.gap,
        },
        control: {
          width: vars.sizeLarge.enabled.control.size,
          height: vars.sizeLarge.enabled.control.size,
          margin: `calc((${vars.sizeLarge.enabled.root.minHeight} - ${vars.sizeLarge.enabled.control.size}) / 2) 0`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          marginBlockStart: "7px", // 수직 위치 보정
        },
        icon: {
          width: vars.sizeLarge.enabled.icon.size,
          height: vars.sizeLarge.enabled.icon.size,
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          gap: vars.sizeMedium.enabled.root.gap,
        },
        control: {
          width: vars.sizeMedium.enabled.control.size,
          height: vars.sizeMedium.enabled.control.size,
          margin: `calc((${vars.sizeMedium.enabled.root.minHeight} - ${vars.sizeMedium.enabled.control.size}) / 2) 0`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          marginBlockStart: "6px", // 수직 위치 보정
        },
        icon: {
          width: vars.sizeMedium.enabled.icon.size,
          height: vars.sizeMedium.enabled.icon.size,
        },
      },
      small: {
        root: {
          minHeight: vars.sizeSmall.enabled.root.minHeight,
          gap: vars.sizeSmall.enabled.root.gap,
        },
        control: {
          width: vars.sizeSmall.enabled.control.size,
          height: vars.sizeSmall.enabled.control.size,
          margin: `calc((${vars.sizeSmall.enabled.root.minHeight} - ${vars.sizeSmall.enabled.control.size}) / 2) 0`, // 수직 위치 보정
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          marginBlockStart: "5px", // 수직 위치 보정
        },
        icon: {
          width: vars.sizeSmall.enabled.icon.size,
          height: vars.sizeSmall.enabled.icon.size,
        },
      },
    },
  },
});

export default radio;
