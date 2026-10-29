import { vars as tokens } from "../vars";
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
    "placeholder",
    "dots",
    "dot",
    "caret",
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
    // 입력과 측정용 텍스트(자리 수만큼의 "0")나 masked 점을 한 칸에 겹쳐, 입력 너비를 보이는 내용에 맞춘다.
    valueContainer: {
      display: "inline-grid",
      alignSelf: "stretch",
      flex: "none",

      // fill·start Segment의 입력은 남은 공간을 채워 긴 placeholder도 보이게 한다.
      // 뒤에 staticSuffix가 있으면 입력 바로 뒤에 붙도록 늘리지 않는다.
      [pseudo("[data-sizing=fill]:not([data-align=center]):last-child")]: {
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

      // masked 입력의 글자와 caret은 숨기고, 겹쳐 둔 점과 caret이 대신 보인다.
      [pseudo("[data-masked]")]: {
        color: "transparent",
        WebkitTextFillColor: "transparent",
        caretColor: "transparent",
      },

      [pseudo("[data-masked]::selection")]: {
        backgroundColor: "transparent",
      },
    },
    placeholder: {
      gridArea: "1 / 1",
      alignSelf: "center",
      display: "flex",
      pointerEvents: "none",

      color: vars.base.enabled.placeholder.color,

      // 입력 칸은 숫자 폭이라 점보다 넓다. 뒤에 정적 내용이 붙으면 끝에 붙여 점 사이 간격을 고르게 한다.
      [pseudo("[data-before-suffix]")]: {
        justifySelf: "end",
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.placeholder.color,
      },
    },
    dots: {
      gridArea: "1 / 1",
      alignSelf: "center",
      display: "inline-flex",
      alignItems: "center",
      flex: "none",
      gap: tokens.$dimension.x2,
      verticalAlign: "middle",
      pointerEvents: "none",

      // 입력 뒤·앞에 붙는 정적 점은 입력과 점 사이도 같은 간격으로 띄운다.
      "[data-position=suffix] > &": {
        marginInlineStart: tokens.$dimension.x2,
      },
      "[data-position=prefix] > &": {
        marginInlineEnd: tokens.$dimension.x2,
      },

      // Figma의 masked Segment는 점 묶음 좌우에 여백을 둔다.
      [pseudo("[data-masked]")]: {
        paddingInline: tokens.$dimension.x1,
        color: vars.base.enabled.maskedPlaceholder.color,
      },

      [pseudo("[data-masked]", disabled)]: {
        color: vars.base.disabled.maskedPlaceholder.color,
      },
    },
    dot: {
      flex: "none",
      width: "7px",
      height: "7px",
      borderRadius: tokens.$radius.full,
      backgroundColor: "currentColor",

      [pseudo("[data-filled]")]: {
        color: vars.base.enabled.value.color,
      },

      [pseudo("[data-filled]", disabled)]: {
        color: vars.base.disabled.value.color,
      },
    },
    caret: {
      display: "none",
      flex: "none",
      borderRadius: tokens.$radius.full,
      backgroundColor: vars.base.enabled.value.color,
      // 점 사이 간격 가운데에 두되, 점 위치는 밀지 않는다.
      marginInline: `calc((${tokens.$dimension.x2} + var(--seed-segmented-text-input-caret-width)) / -2)`,
      width: "var(--seed-segmented-text-input-caret-width)",
      animation: "caret-blink 1s step-end infinite",

      [pseudo("[data-focus]:not([data-readonly])")]: {
        display: "block",
      },
    },
    staticText: {
      // 안에 넣은 Dots가 글자 기준선이 아니라 줄 가운데에 오도록 flex로 세로 가운데에 둔다.
      display: "flex",
      alignItems: "center",
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
        caret: {
          // Figma의 caret 크기
          "--seed-segmented-text-input-caret-width": "1.5px",
          height: "20px",
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
        caret: {
          // Figma의 caret 크기
          "--seed-segmented-text-input-caret-width": "1px",
          height: "17px",
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
});

export default segmentedTextInput;
