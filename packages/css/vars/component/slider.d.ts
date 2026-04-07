export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "gap": "var(--ride-dimension-x0_5)"
      },
      "control": {
        "height": "26px"
      },
      "track": {
        "height": "var(--ride-dimension-x1)",
        "cornerRadius": "var(--ride-radius-full)",
        "color": "var(--ride-color-palette-gray-400)"
      },
      "range": {
        "cornerRadius": "var(--ride-radius-full)",
        "color": "var(--ride-color-fg-neutral)",
        "widthDuration": "var(--ride-duration-d3)",
        "widthTimingFunction": "var(--ride-timing-function-easing)"
      },
      "thumb": {
        "size": "var(--ride-dimension-x5)",
        "cornerRadius": "var(--ride-radius-full)",
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      /** arrow width + (valueIndicatorRoot paddingX * 2)만큼의 최소 너비를 가집니다. */
      "valueIndicatorRoot": {
        "color": "var(--ride-color-bg-neutral-inverted)",
        "cornerRadius": "var(--ride-radius-r1_5)",
        /** value indicator 내부 좌우 여백입니다. arrow와 valueIndicatorRoot 경계 사이의 최소 간격에도 동일한 값이 적용됩니다. */
        "paddingX": "var(--ride-dimension-x2)",
        "paddingY": "var(--ride-dimension-x1)",
        "offsetY": "var(--ride-dimension-x3)",
        "enterScale": "0.9",
        "enterOpacity": "0",
        "enterDuration": "var(--ride-duration-d4)",
        "enterTimingFunction": "var(--ride-timing-function-enter)",
        "exitScale": "1",
        "exitOpacity": "0",
        "exitDuration": "var(--ride-duration-d4)",
        "exitTimingFunction": "var(--ride-timing-function-easing)",
        "translateDuration": "var(--ride-duration-d3)",
        "translateTimingFunction": "var(--ride-timing-function-easing)"
      },
      "valueIndicatorArrow": {
        "color": "var(--ride-color-bg-neutral-inverted)",
        "width": "var(--ride-dimension-x2)",
        "height": "var(--ride-dimension-x1_5)",
        "cornerRadius": "var(--ride-radius-r0_5)",
        /** arrow와 thumb 사이의 거리를 정의합니다. */
        "gutter": "var(--ride-dimension-x0_5)"
      },
      "valueIndicatorLabel": {
        "color": "var(--ride-color-fg-neutral-inverted)",
        "fontSize": "var(--ride-font-size-t3)",
        "lineHeight": "var(--ride-line-height-t3)",
        "fontWeight": "var(--ride-font-weight-medium)"
      },
      "marker": {
        "color": "var(--ride-color-fg-neutral-muted)",
        "fontWeight": "var(--ride-font-weight-regular)",
        "fontSize": "var(--ride-font-size-t3)",
        "lineHeight": "var(--ride-line-height-t3)"
      }
    },
    "disabled": {
      "range": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "thumb": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "marker": {
        "color": "var(--ride-color-fg-disabled)"
      }
    }
  }
}