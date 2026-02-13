export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "control": {
        "height": "26px"
      },
      "track": {
        "height": "var(--seed-dimension-x1)",
        "cornerRadius": "var(--seed-radius-full)",
        "color": "var(--seed-color-palette-gray-400)"
      },
      "range": {
        "cornerRadius": "var(--seed-radius-full)",
        "color": "var(--seed-color-fg-neutral)",
        "widthDuration": "var(--seed-duration-d3)",
        "widthTimingFunction": "var(--seed-timing-function-easing)"
      },
      "thumb": {
        "size": "var(--seed-dimension-x5)",
        "cornerRadius": "var(--seed-radius-full)",
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      /** arrow width + (valueIndicatorRoot paddingX * 2)만큼의 최소 너비를 가집니다. */
      "valueIndicatorRoot": {
        "color": "var(--seed-color-bg-neutral-inverted)",
        "cornerRadius": "var(--seed-radius-r1_5)",
        /** value indicator 내부 좌우 여백입니다. arrow와 valueIndicatorRoot 경계 사이의 최소 간격에도 동일한 값이 적용됩니다. */
        "paddingX": "var(--seed-dimension-x2)",
        "paddingY": "var(--seed-dimension-x1)",
        "offsetY": "var(--seed-dimension-x3)",
        "enterScale": "0.9",
        "enterOpacity": "0",
        "enterDuration": "var(--seed-duration-d4)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "exitScale": "1",
        "exitOpacity": "0",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-easing)"
      },
      "valueIndicatorArrow": {
        "color": "var(--seed-color-bg-neutral-inverted)",
        "width": "var(--seed-dimension-x2)",
        "height": "var(--seed-dimension-x1_5)",
        "cornerRadius": "var(--seed-radius-r0_5)",
        /** arrow와 thumb 사이의 거리를 정의합니다. */
        "gutter": "var(--seed-dimension-x0_5)"
      },
      "valueIndicatorLabel": {
        "color": "var(--seed-color-fg-neutral-inverted)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "marker": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      }
    },
    "disabled": {
      "range": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "thumb": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "marker": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}