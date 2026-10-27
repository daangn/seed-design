import { segmentedTextInput as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { pseudo, focus, disabled, not, readOnly, invalid } from "../utils/pseudo";

const MAX_DURATION_SECONDS = 2147483647;

const segmentedTextInput = defineSlotRecipe({
  name: "segmented-text-input",
  slots: [
    "root",
    "segment",
    "valueContainer",
    "valueSizer",
    "value",
    "staticText",
    "separator",
    "suffix",
  ],
  base: {
    root: {
      boxSizing: "border-box",
      display: "flex",
      width: "100%",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",

      // 입력값·정적 불릿·Separator가 입력이나 삭제로 밀리지 않도록 숫자 너비를 고정한다.
      fontVariantNumeric: "tabular-nums",

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth: vars.base.focused.root.strokeWidth,

        transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo(not(readOnly), focus, "::after")]: {
        borderColor: vars.base.focused.root.strokeColor,
        borderWidth: vars.base.focused.root.strokeWidth,
      },

      [pseudo(invalid, "::after")]: {
        borderColor: vars.base.invalid.root.strokeColor,
        borderWidth: vars.base.invalid.root.strokeWidth,
      },

      [pseudo(invalid, focus, "::after")]: {
        borderColor: vars.base.invalidFocused.root.strokeColor,
        borderWidth: vars.base.invalid.root.strokeWidth,
      },

      [pseudo(disabled)]: {
        backgroundColor: vars.base.disabled.root.color,
      },

      // apply disabled style if readonly && disabled both are true
      [pseudo(readOnly, not(disabled))]: {
        backgroundColor: vars.base.readonly.root.color,
      },
    },
    segment: {
      display: "flex",
      alignItems: "center",
      alignSelf: "stretch",
      flex: "none",
      minWidth: 0,

      [pseudo("[data-sizing=fill]")]: {
        flex: "1 1 0",
      },

      // align=center는 입력 텍스트가 아니라 Segment 내용 묶음을 가운데에 둔다.
      [pseudo("[data-align=center]")]: {
        justifyContent: "center",
      },
    },
    // 입력과 측정용 텍스트(자리 수만큼의 "0" 또는 "•")를 한 칸에 겹쳐, 입력 너비를 실제 글자 너비에 맞춘다.
    // masked 입력의 불릿도 폰트의 U+2022로 그려지므로 placeholder 불릿과 같은 위치에서 채워진다.
    valueContainer: {
      display: "inline-grid",
      alignSelf: "stretch",
      flex: "none",

      // fill·start Segment의 입력은 남은 공간을 채워 긴 placeholder도 보이게 한다.
      [pseudo("[data-sizing=fill]:not([data-align=center])")]: {
        flex: "1 1 0",
      },
    },
    valueSizer: {
      gridArea: "1 / 1",
      alignSelf: "center",
      visibility: "hidden",
      whiteSpace: "pre",
      overflow: "hidden",
      pointerEvents: "none",
    },
    value: {
      gridArea: "1 / 1",
      boxSizing: "border-box",
      font: "inherit",
      fontVariantNumeric: "inherit",

      background: "none",
      border: "none",
      outline: "none",
      alignSelf: "stretch",
      // 입력의 기본 너비(size 속성)가 칸 너비에 끼어들지 않게 하고, 측정용 텍스트가 만든 칸을 채운다.
      width: 0,
      minWidth: "100%",
      padding: 0,
      margin: 0,

      color: vars.base.enabled.value.color,
      fontWeight: vars.base.enabled.value.fontWeight,

      [pseudo("::placeholder")]: {
        color: vars.base.enabled.placeholder.color,
        fontWeight: vars.base.enabled.placeholder.fontWeight,
        opacity: 1,
      },

      [pseudo("[data-masked]::placeholder")]: {
        color: vars.base.enabled.maskedPlaceholder.color,
      },

      // disable browser default background colors (same as text-input)
      [pseudo(":is(:-webkit-autofill, :autofill)")]: {
        WebkitTextFillColor: vars.base.enabled.value.color,

        transition: `background-color ${MAX_DURATION_SECONDS}s ${MAX_DURATION_SECONDS}s`,

        "@supports (background-clip: text)": {
          backgroundClip: "text",
          transition: "none",
        },
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.value.color,
        WebkitTextFillColor: vars.base.disabled.value.color,

        cursor: "not-allowed",
      },

      [pseudo(disabled, "::placeholder")]: {
        color: vars.base.disabled.placeholder.color,
      },

      [pseudo(disabled, "[data-masked]::placeholder")]: {
        color: vars.base.disabled.maskedPlaceholder.color,
      },
    },
    staticText: {
      flex: "none",
      whiteSpace: "pre",
      userSelect: "none",

      color: vars.base.enabled.staticText.color,
      fontWeight: vars.base.enabled.staticText.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.staticText.color,
      },
    },
    separator: {
      flex: "none",
      whiteSpace: "pre",
      userSelect: "none",

      color: vars.base.enabled.separator.color,
      fontWeight: vars.base.enabled.separator.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.separator.color,
      },
    },
    suffix: {
      display: "flex",
      alignItems: "center",
      flex: "none",
      marginInlineStart: "auto",
    },
  },
  variants: {
    size: {
      large: {
        root: {
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
          paddingInline: vars.sizeLarge.enabled.root.paddingX,
        },
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
        staticText: {
          fontSize: vars.sizeLarge.enabled.staticText.fontSize,
          lineHeight: vars.sizeLarge.enabled.staticText.lineHeight,
        },
        separator: {
          fontSize: vars.sizeLarge.enabled.separator.fontSize,
          lineHeight: vars.sizeLarge.enabled.separator.lineHeight,
        },
        suffix: {
          paddingInlineStart: vars.sizeLarge.enabled.root.gap,
        },
      },
      medium: {
        root: {
          minHeight: vars.sizeMedium.enabled.root.minHeight,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
        },
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
        staticText: {
          fontSize: vars.sizeMedium.enabled.staticText.fontSize,
          lineHeight: vars.sizeMedium.enabled.staticText.lineHeight,
        },
        separator: {
          fontSize: vars.sizeMedium.enabled.separator.fontSize,
          lineHeight: vars.sizeMedium.enabled.separator.lineHeight,
        },
        suffix: {
          paddingInlineStart: vars.sizeMedium.enabled.root.gap,
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
});

export default segmentedTextInput;
