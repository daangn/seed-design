export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x4)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "marginDuration": "var(--seed-duration-d3)",
        "marginTimingFunction": "var(--seed-timing-function-easing)",
        "borderRadiusDuration": "var(--seed-duration-d3)",
        "borderRadiusTimingFunction": "var(--seed-timing-function-easing)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "label": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "description": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "indicator": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        "marginX": "var(--seed-dimension-x2)",
        "cornerRadius": "var(--seed-radius-r3)"
      }
    },
    "disabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "description": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "indicator": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  /**
   * 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "sizeLarge": {
    "enabled": {
      "root": {
        "paddingY": "var(--seed-dimension-x3)",
        "gap": "var(--seed-dimension-x3)"
      },
      "prefixIcon": {
        "size": "22px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "indicator": {
        "size": "var(--seed-dimension-x3_5)"
      }
    }
  },
  /**
   * Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "sizeMedium": {
    "enabled": {
      "root": {
        "paddingY": "var(--seed-dimension-x2_5)",
        "gap": "var(--seed-dimension-x2)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x4_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      },
      "indicator": {
        "size": "var(--seed-dimension-x3)"
      }
    }
  }
}