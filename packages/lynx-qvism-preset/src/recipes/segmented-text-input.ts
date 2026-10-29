import { vars as tokens } from "../vars";
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
    "placeholder",
    "placeholderBeforeSuffix",
    "dots",
    "maskedDots",
    "dot",
    "placeholderDot",
    "maskedDot",
    "filledDot",
    "caret",
    "readOnlyValue",
    "readOnlyText",
    "readOnlyPlaceholder",
    "maskedReadOnlyText",
    "staticText",
    "staticContent",
    "staticPrefix",
    "staticSuffix",
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
    // 측정용 텍스트(자리 수만큼의 "0")나 masked 점이 너비를 정하고, 입력은 그 위를 덮는다.
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
    // iOS UITextField는 글자 폭과 입력 폭이 같으면 반올림 차이로 placeholder를 말줄임하고, caret 자리만큼 값을 밀어낸다.
    // 입력을 측정용 텍스트보다 오른쪽으로 조금 넓혀 여유를 둔다. 배경이 투명해 뒤 요소를 가리지 않는다.
    value: {
      position: "absolute",
      top: 0,
      right: `calc(-1 * ${tokens.$dimension.x1})`,
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
    // masked 입력의 글자와 caret은 숨기고, 아래에 그린 점과 caret이 대신 보인다.
    maskedValue: {
      color: "transparent",
      caretColor: "transparent",
    },
    // 문자열이 아닌 placeholder(예: Dots)를 입력 칸 위에 겹쳐 그린다.
    placeholder: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      pointerEvents: "none",
    },
    // 입력 칸은 숫자 폭이라 점보다 넓다. 뒤에 정적 내용이 붙으면 끝에 붙여 점 사이 간격을 고르게 한다.
    placeholderBeforeSuffix: {
      justifyContent: "flex-end",
    },
    dots: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      gap: tokens.$dimension.x2,
    },
    // Figma의 masked Segment는 점 묶음 좌우에 여백을 둔다.
    maskedDots: {
      alignSelf: "stretch",
      paddingLeft: tokens.$dimension.x1,
      paddingRight: tokens.$dimension.x1,
    },
    // Lynx view에는 currentColor가 없어 점이 놓인 자리마다 색을 slot으로 나눈다.
    dot: {
      flexShrink: 0,
      width: "7px",
      height: "7px",
      borderRadius: tokens.$radius.full,
      backgroundColor: vars.base.enabled.staticText.color,
    },
    placeholderDot: {
      backgroundColor: vars.base.enabled.placeholder.color,
    },
    maskedDot: {
      backgroundColor: vars.base.enabled.maskedPlaceholder.color,
    },
    filledDot: {
      backgroundColor: vars.base.enabled.value.color,
    },
    caret: {
      flexShrink: 0,
      borderRadius: tokens.$radius.full,
      backgroundColor: vars.base.enabled.value.color,
      animation: "caret-blink 1s step-end infinite",
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
    // readOnly masked Segment는 점을 그리고, 탭·보조기기용 `<text>`는 내용 없이 그 위를 덮는다.
    maskedReadOnlyText: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    staticText: {
      flexShrink: 0,
      whiteSpace: "nowrap",
      color: vars.base.enabled.staticText.color,
      fontWeight: vars.base.enabled.staticText.fontWeight,
    },
    // 문자열이 아닌 정적 내용(예: Dots)은 글자 기준선이 아니라 줄 가운데에 오도록 세로 가운데에 둔다.
    staticContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      flexShrink: 0,
    },
    // 입력 앞·뒤에 붙는 정적 점은 입력과 점 사이도 점 간격만큼 띄운다.
    staticPrefix: {
      marginRight: tokens.$dimension.x2,
    },
    staticSuffix: {
      marginLeft: tokens.$dimension.x2,
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
        // Figma의 caret 크기. 점 사이 간격 가운데에 두되, 점 위치는 밀지 않는다.
        caret: {
          width: "1.5px",
          height: "20px",
          marginLeft: `calc((${tokens.$dimension.x2} + 1.5px) / -2)`,
          marginRight: `calc((${tokens.$dimension.x2} + 1.5px) / -2)`,
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
        caret: {
          width: "1px",
          height: "17px",
          marginLeft: `calc((${tokens.$dimension.x2} + 1px) / -2)`,
          marginRight: `calc((${tokens.$dimension.x2} + 1px) / -2)`,
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
        dot: { backgroundColor: vars.base.disabled.staticText.color },
        placeholderDot: { backgroundColor: vars.base.disabled.placeholder.color },
        maskedDot: { backgroundColor: vars.base.disabled.maskedPlaceholder.color },
        filledDot: { backgroundColor: vars.base.disabled.value.color },
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
