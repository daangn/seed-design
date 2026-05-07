export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "marginDuration": "var(--seed-duration-d3)",
        "marginTimingFunction": "var(--seed-timing-function-easing)",
        "borderRadiusDuration": "var(--seed-duration-d3)",
        "borderRadiusTimingFunction": "var(--seed-timing-function-easing)"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "label": {
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "description": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-subtle)"
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
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "description": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  /**
   * 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "sizeMedium": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x3)",
        "gap": "var(--seed-dimension-x3)"
      },
      "prefixIcon": {
        "size": "22px"
      },
      "suffixIcon": {
        "size": "18px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      }
    }
  },
  /**
   * Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "sizeSmall": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2_5)",
        "gap": "var(--seed-dimension-x2)"
      },
      "prefixIcon": {
        "size": "18px"
      },
      "suffixIcon": {
        "size": "16px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      }
    }
  },
  /**
   * 일반적인 작업을 수행하는 기본 아이템입니다.
   */
  "toneNeutral": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      }
    }
  },
  /**
   * 데이터 삭제와 같이 되돌릴 수 없는 작업을 수행하는 아이템입니다.
   */
  "toneCritical": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-critical)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-critical)"
      },
      "label": {
        "color": "var(--seed-color-fg-critical)"
      }
    }
  }
}