export declare const vars: {
  "base": {
    "enabled": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
      "suffixText": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      /** 콘텐츠 레이어와 별개로 이 슬롯만 따로 축소됩니다. */
      "clearButton": {
        "color": "var(--seed-color-fg-neutral-subtle)"
      }
    },
    "pressed": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "invalid": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "disabled": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
      "suffixText": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "readonly": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
      "suffixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)"
      },
      /** 콘텐츠 레이어와 별개로 이 슬롯만 따로 축소됩니다. */
      "clearButton": {
        "size": "22px"
      }
    }
  },
  /**
   * Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "sizeMedium": {
    "enabled": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 stroke는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
      "suffixText": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      /** 콘텐츠 레이어와 별개로 이 슬롯만 따로 축소됩니다. */
      "clearButton": {
        "size": "var(--seed-dimension-x4_5)"
      }
    }
  }
}