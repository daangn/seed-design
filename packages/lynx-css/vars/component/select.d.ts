export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        "color": "var(--seed-color-bg-transparent)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        /** enabled 상태의 stroke 위에 invalid 상태의 stroke가 fade in/out 되는 데에 걸리는 시간입니다. stroke 두께나 색상 자체를 transition하지 않습니다. */
        "strokeDuration": "0.1s",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "value": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "placeholder": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-placeholder)"
      },
      "prefixText": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "rotateDuration": "var(--seed-duration-d6)",
        "rotateTimingFunction": "var(--seed-timing-function-easing)"
      },
      "content": {
        "cornerRadius": "var(--seed-radius-r5)",
        "color": "var(--seed-color-bg-layer-floating)",
        "shadow": "var(--seed-shadow-s3)",
        "enterDuration": "var(--seed-duration-d3)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterScale": "0.95",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitScale": "0.95",
        "exitOpacity": "0",
        "paddingY": "var(--seed-dimension-x2)",
        "gap": "var(--seed-dimension-x2)",
        /** 트리거와 목록 사이의 간격을 정의합니다. */
        "gutter": "var(--seed-dimension-x2)",
        /** 목록과 뷰포트 경계 사이의 최소 간격을 정의합니다. */
        "overflowPadding": "var(--seed-dimension-x2)",
        "maxHeight": "480px"
      },
      "groupLabel": {
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "divider": {
        "marginX": "var(--seed-dimension-x4)",
        "height": "1px",
        "color": "var(--seed-color-stroke-neutral-muted)"
      },
      "item": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "marginDuration": "var(--seed-duration-d3)",
        "marginTimingFunction": "var(--seed-timing-function-easing)",
        "borderRadiusDuration": "var(--seed-duration-d3)",
        "borderRadiusTimingFunction": "var(--seed-timing-function-easing)"
      },
      "itemPrefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "itemSuffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "itemBody": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "itemLabel": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "itemDescription": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "itemIndicator": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      },
      "item": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        "marginX": "var(--seed-dimension-x2)",
        "cornerRadius": "var(--seed-radius-r3)"
      }
    },
    "invalid": {
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "value": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixText": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemPrefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemSuffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemLabel": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemDescription": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemIndicator": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "readonly": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "value": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-placeholder)"
      }
    }
  },
  /**
   * 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "sizeLarge": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x13)",
        "gap": "var(--seed-dimension-x2_5)",
        "cornerRadius": "var(--seed-radius-r3)",
        "paddingX": "var(--seed-dimension-x4)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)"
      },
      "content": {
        "width": "240px"
      },
      "groupLabel": {
        "paddingY": "var(--seed-dimension-x2_5)",
        "paddingX": "var(--seed-dimension-x4)",
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "item": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x3)",
        "gap": "var(--seed-dimension-x3)"
      },
      "itemPrefixIcon": {
        "size": "22px"
      },
      "itemSuffixIcon": {
        "size": "18px"
      },
      "itemLabel": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "itemDescription": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "itemIndicator": {
        "size": "18px"
      }
    }
  },
  /**
   * Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x10)",
        "gap": "var(--seed-dimension-x2)",
        "cornerRadius": "var(--seed-radius-r2)",
        "paddingX": "var(--seed-dimension-x3_5)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "content": {
        "width": "200px"
      },
      "groupLabel": {
        "paddingY": "var(--seed-dimension-x2)",
        "paddingX": "var(--seed-dimension-x4)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "item": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2_5)",
        "gap": "var(--seed-dimension-x2)"
      },
      "itemPrefixIcon": {
        "size": "18px"
      },
      "itemSuffixIcon": {
        "size": "16px"
      },
      "itemLabel": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "itemDescription": {
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      },
      "itemIndicator": {
        "size": "16px"
      }
    }
  }
}