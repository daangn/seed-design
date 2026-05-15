export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-r3)",
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        /** enabled 상태의 stroke 위에 selected 상태의 stroke가 fade in/out 되는 데에 걸리는 시간입니다. stroke 두께나 색상 자체를 transition하지 않습니다. */
        "strokeDuration": "0.1s",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "trigger": {
        "gap": "var(--seed-dimension-x1_5)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)",
        "size": "22px"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)",
        "paddingRight": "var(--seed-dimension-x1)"
      },
      "label": {
        "gap": "var(--seed-dimension-x1)",
        "color": "var(--seed-color-fg-neutral)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "footer": {
        /** 열릴 때는 천천히 펼쳐지고 빠르게 fade in됩니다. */
        "expandHeightDuration": "400ms",
        "expandHeightTimingFunction": "var(--seed-timing-function-easing)",
        /** 열릴 때는 천천히 펼쳐지고 빠르게 fade in됩니다. */
        "expandOpacityDuration": "var(--seed-duration-d6)",
        "expandOpacityTimingFunction": "var(--seed-timing-function-easing)",
        /** 닫힐 때는 빠르게 접히고 천천히 fade out됩니다. */
        "collapseHeightDuration": "var(--seed-duration-d6)",
        "collapseHeightTimingFunction": "var(--seed-timing-function-easing)",
        /** 닫힐 때는 빠르게 접히고 천천히 fade out됩니다. */
        "collapseOpacityDuration": "400ms",
        "collapseOpacityTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "selected": {
      "root": {
        "strokeWidth": "2px"
      }
    },
    "enabledSelected": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-contrast)"
      }
    },
    "disabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "description": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    }
  },
  "layoutHorizontal": {
    "enabled": {
      "trigger": {
        "paddingLeft": "var(--seed-dimension-x5)",
        "paddingRight": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x4)"
      },
      "content": {
        "gap": "var(--seed-dimension-x3)"
      }
    }
  },
  "layoutVertical": {
    "enabled": {
      "trigger": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x5)"
      },
      "content": {
        "gap": "var(--seed-dimension-x2_5)"
      }
    }
  }
}