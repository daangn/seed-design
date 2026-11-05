export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        /** enabled 상태의 stroke 위에 focused/invalid 상태의 stroke가 fade in/out 되는 데에 걸리는 시간입니다. stroke 두께나 색상 자체를 transition하지 않습니다. */
        "strokeDuration": "0.1s",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "value": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "placeholder": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-placeholder)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "maskedPlaceholder": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-placeholder)"
      },
      "separator": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-placeholder)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "staticText": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)"
      }
    },
    "focused": {
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-neutral-contrast)"
      }
    },
    "invalid": {
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "invalidFocused": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "readonly": {
      "root": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-bg-disabled)"
      }
    },
    "disabled": {
      "root": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-bg-disabled)"
      },
      "value": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-disabled)"
      },
      "placeholder": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-disabled)"
      },
      "maskedPlaceholder": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-disabled)"
      },
      "separator": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
        "color": "var(--seed-color-fg-disabled)"
      },
      "staticText": {
        /** Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다. */
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
        "gap": "var(--seed-dimension-x2_5)",
        "minHeight": "var(--seed-dimension-x13)",
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
      "separator": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "staticText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      }
    }
  },
  /**
   * Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "sizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2)",
        "minHeight": "var(--seed-dimension-x10)",
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
      "separator": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "staticText": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  }
}