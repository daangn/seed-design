export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x13)",
        "cornerRadius": "var(--seed-radius-r3)",
        "gap": "var(--seed-dimension-x2_5)",
        "paddingX": "var(--seed-dimension-x4)",
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
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-placeholder)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x5)",
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "suffixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)",
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "clearButton": {
        "size": "22px",
        "color": "var(--seed-color-fg-neutral-subtle)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
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
  }
}