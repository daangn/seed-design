export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--ride-radius-r3)",
        "color": "var(--ride-color-bg-transparent)",
        "strokeColor": "var(--ride-color-stroke-neutral-muted)",
        "strokeWidth": "1px",
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)",
        /** enabled 상태의 stroke 위에 selected 상태의 stroke가 fade in/out 되는 데에 걸리는 시간입니다. stroke 두께나 색상 자체를 transition하지 않습니다. */
        "strokeDuration": "0.1s",
        "strokeTimingFunction": "var(--ride-timing-function-easing)"
      },
      "trigger": {
        "gap": "var(--ride-dimension-x1_5)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral)",
        "size": "22px"
      },
      "body": {
        "gap": "var(--ride-dimension-x0_5)",
        "paddingRight": "var(--ride-dimension-x1)"
      },
      "label": {
        "gap": "var(--ride-dimension-x1)",
        "color": "var(--ride-color-fg-neutral)",
        "fontSize": "var(--ride-font-size-t5)",
        "lineHeight": "var(--ride-line-height-t5)",
        "fontWeight": "var(--ride-font-weight-medium)"
      },
      "description": {
        "color": "var(--ride-color-fg-neutral-muted)",
        "fontSize": "var(--ride-font-size-t3)",
        "lineHeight": "var(--ride-line-height-t3)",
        "fontWeight": "var(--ride-font-weight-regular)"
      },
      "footer": {
        /** 열릴 때는 천천히 펼쳐지고 빠르게 fade in됩니다. */
        "expandHeightDuration": "400ms",
        "expandHeightTimingFunction": "var(--ride-timing-function-easing)",
        /** 열릴 때는 천천히 펼쳐지고 빠르게 fade in됩니다. */
        "expandOpacityDuration": "var(--ride-duration-d6)",
        "expandOpacityTimingFunction": "var(--ride-timing-function-easing)",
        /** 닫힐 때는 빠르게 접히고 천천히 fade out됩니다. */
        "collapseHeightDuration": "var(--ride-duration-d6)",
        "collapseHeightTimingFunction": "var(--ride-timing-function-easing)",
        /** 닫힐 때는 빠르게 접히고 천천히 fade out됩니다. */
        "collapseOpacityDuration": "400ms",
        "collapseOpacityTimingFunction": "var(--ride-timing-function-easing)"
      }
    },
    "selected": {
      "root": {
        "strokeWidth": "2px"
      }
    },
    "enabledSelected": {
      "root": {
        "strokeColor": "var(--ride-color-stroke-neutral-contrast)"
      }
    },
    "disabled": {
      "root": {
        "strokeColor": "var(--ride-color-stroke-neutral-muted)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "label": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "description": {
        "color": "var(--ride-color-fg-disabled)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--ride-color-bg-transparent-pressed)"
      }
    }
  },
  "layoutHorizontal": {
    "enabled": {
      "trigger": {
        "paddingLeft": "var(--ride-dimension-x5)",
        "paddingRight": "var(--ride-dimension-x4)",
        "paddingY": "var(--ride-dimension-x4)"
      },
      "content": {
        "gap": "var(--ride-dimension-x3)"
      }
    }
  },
  "layoutVertical": {
    "enabled": {
      "trigger": {
        "paddingX": "var(--ride-dimension-x4)",
        "paddingY": "var(--ride-dimension-x5)"
      },
      "content": {
        "gap": "var(--ride-dimension-x2_5)"
      }
    }
  }
}