export const vars = {
  "base": {
    "enabled": {
      "backdrop": {
        "color": "var(--seed-color-bg-overlay)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d6)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "widthFraction": "0.8",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "exitDuration": "var(--seed-duration-d6)",
        "exitTimingFunction": "var(--seed-timing-function-exit-expressive)"
      },
      "header": {
        "gap": "var(--seed-dimension-x1_5)",
        "minHeight": "70px",
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x4)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x12)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x4)",
        "paddingBottom": "var(--seed-dimension-x6)",
        "gap": "var(--seed-dimension-x2)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)",
        "fontSize": "var(--seed-font-size-t8)",
        "lineHeight": "var(--seed-line-height-t8)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "closeButton": {
        "fromTop": "28px",
        "fromRight": "24px"
      }
    },
    "scrolled": {
      "body": {
        "stroke": "var(--seed-color-stroke-neutral-muted)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "content": {
        "width": "480px"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "content": {
        "width": "720px"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "content": {
        "width": "960px"
      }
    }
  }
}