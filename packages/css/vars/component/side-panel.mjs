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
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "exitDuration": "var(--seed-duration-d6)",
        "exitTimingFunction": "var(--seed-timing-function-exit-expressive)"
      },
      "header": {
        "gap": "var(--seed-dimension-x1_5)",
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x4)"
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
        "fontWeight": "var(--seed-font-weight-regular)",
        "paddingX": "var(--seed-dimension-x6)"
      },
      "closeButton": {
        "fromTop": "var(--seed-dimension-x6)",
        "fromRight": "var(--seed-dimension-x4)"
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