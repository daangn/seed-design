import { segmentedTextInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";

const segmentedTextInput = defineSlotRecipe({
  name: "segmented-text-input",
  slots: [
    "root",
    "baseStroke",
    "stroke",
    "segment",
    "segmentFill",
    "segmentCenter",
    "valueContainer",
    "valueContainerFill",
    "valueSizer",
    "value",
    "maskedValue",
    "readOnlyValue",
    "readOnlyText",
    "readOnlyPlaceholder",
    "staticText",
    "separator",
    "suffix",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },
    baseStroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderStyle: "solid",
      borderColor: vars.base.enabled.root.strokeColor,
      borderWidth: vars.base.enabled.root.strokeWidth,
      pointerEvents: "none",
    },
    stroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderStyle: "solid",
      borderColor: "transparent",
      borderWidth: vars.base.focused.root.strokeWidth,
      transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,
      pointerEvents: "none",
    },
    segment: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      flexShrink: 0,
      minWidth: 0,
    },
    // sizing="fill"이면 남은 공간을 나눠 가진다.
    segmentFill: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    // align="center"는 입력 텍스트가 아니라 Segment 내용 묶음을 가운데에 둔다.
    segmentCenter: {
      justifyContent: "center",
    },
    // 측정용 텍스트(자리 수만큼의 "0" 또는 "•")가 너비를 정하고, 입력은 그 위를 덮는다.
    valueContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      flexShrink: 0,
      position: "relative",
    },
    // fill·start Segment의 입력은 남은 공간을 채워 긴 placeholder도 보이게 한다.
    valueContainerFill: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
    },
    valueSizer: {
      visibility: "hidden",
      whiteSpace: "nowrap",
    },
    value: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
      color: vars.base.enabled.value.color,
      fontWeight: vars.base.enabled.value.fontWeight,
      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
        fontWeight: vars.base.enabled.placeholder.fontWeight,
      },
    },
    maskedValue: {
      [pseudo("::placeholder")]: {
        color: vars.base.enabled.maskedPlaceholder.color,
      },
    },
    // readOnly에서 native 입력 대신 `<text>`를 입력과 같은 자리에 세로 가운데로 둔다.
    readOnlyValue: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    readOnlyText: {
      whiteSpace: "nowrap",
      color: vars.base.enabled.value.color,
      fontWeight: vars.base.enabled.value.fontWeight,
    },
    readOnlyPlaceholder: {
      color: vars.base.enabled.placeholder.color,
      fontWeight: vars.base.enabled.placeholder.fontWeight,
    },
    staticText: {
      flexShrink: 0,
      whiteSpace: "nowrap",
      color: vars.base.enabled.staticText.color,
      fontWeight: vars.base.enabled.staticText.fontWeight,
    },
    separator: {
      flexShrink: 0,
      whiteSpace: "nowrap",
      color: vars.base.enabled.separator.color,
      fontWeight: vars.base.enabled.separator.fontWeight,
    },
    suffix: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
    },
  },
  variants: {
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
        },
        baseStroke: { borderRadius: vars.sizeLarge.enabled.root.cornerRadius },
        stroke: { borderRadius: vars.sizeLarge.enabled.root.cornerRadius },
        value: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
          [pseudo("::placeholder")]: {
            fontSize: vars.sizeLarge.enabled.placeholder.fontSize,
            lineHeight: vars.sizeLarge.enabled.placeholder.lineHeight,
          },
        },
        valueSizer: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
        readOnlyText: {
          fontSize: vars.sizeLarge.enabled.value.fontSize,
          lineHeight: vars.sizeLarge.enabled.value.lineHeight,
        },
        staticText: {
          fontSize: vars.sizeLarge.enabled.staticText.fontSize,
          lineHeight: vars.sizeLarge.enabled.staticText.lineHeight,
        },
        separator: {
          fontSize: vars.sizeLarge.enabled.separator.fontSize,
          lineHeight: vars.sizeLarge.enabled.separator.lineHeight,
        },
        suffix: {
          paddingLeft: vars.sizeLarge.enabled.root.gap,
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          paddingLeft: vars.sizeMedium.enabled.root.paddingX,
          paddingRight: vars.sizeMedium.enabled.root.paddingX,
        },
        baseStroke: { borderRadius: vars.sizeMedium.enabled.root.cornerRadius },
        stroke: { borderRadius: vars.sizeMedium.enabled.root.cornerRadius },
        value: {
          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
          [pseudo("::placeholder")]: {
            fontSize: vars.sizeMedium.enabled.placeholder.fontSize,
            lineHeight: vars.sizeMedium.enabled.placeholder.lineHeight,
          },
        },
        valueSizer: {
          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
        readOnlyText: {
          fontSize: vars.sizeMedium.enabled.value.fontSize,
          lineHeight: vars.sizeMedium.enabled.value.lineHeight,
        },
        staticText: {
          fontSize: vars.sizeMedium.enabled.staticText.fontSize,
          lineHeight: vars.sizeMedium.enabled.staticText.lineHeight,
        },
        separator: {
          fontSize: vars.sizeMedium.enabled.separator.fontSize,
          lineHeight: vars.sizeMedium.enabled.separator.lineHeight,
        },
        suffix: {
          paddingLeft: vars.sizeMedium.enabled.root.gap,
        },
      },
    },
    focused: {
      true: {
        stroke: { borderColor: vars.base.focused.root.strokeColor },
      },
      false: {},
    },
    invalid: {
      true: {
        stroke: { borderColor: vars.base.invalid.root.strokeColor },
      },
      false: {},
    },
    readOnly: {
      true: {},
      false: {},
    },
    disabled: {
      true: {
        root: { backgroundColor: vars.base.disabled.root.color },
        value: {
          color: vars.base.disabled.value.color,
          [pseudo("::placeholder")]: {
            color: vars.base.disabled.placeholder.color,
          },
        },
        maskedValue: {
          [pseudo("::placeholder")]: {
            color: vars.base.disabled.maskedPlaceholder.color,
          },
        },
        readOnlyText: { color: vars.base.disabled.value.color },
        readOnlyPlaceholder: { color: vars.base.disabled.placeholder.color },
        staticText: { color: vars.base.disabled.staticText.color },
        separator: { color: vars.base.disabled.separator.color },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      invalid: true,
      focused: true,
      css: {
        stroke: { borderColor: vars.base.invalidFocused.root.strokeColor },
      },
    },
    {
      readOnly: true,
      disabled: false,
      css: {
        root: { backgroundColor: vars.base.readonly.root.color },
      },
    },
  ],
  defaultVariants: {
    size: "large",
    focused: false,
    invalid: false,
    readOnly: false,
    disabled: false,
  },
});

export default segmentedTextInput;
