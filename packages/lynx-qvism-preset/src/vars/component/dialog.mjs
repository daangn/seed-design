export const vars = {
  "base": {
    "enabled": {
      "backdrop": {
        "color": "var(--seed-color-bg-overlay)",
        "enterDuration": "var(--seed-duration-d2)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "cornerRadius": "var(--seed-radius-r5)",
        "widthFraction": "0.9",
        "maxHeightFraction": "0.8",
        "marginX": "var(--seed-dimension-x5)",
        "enterDuration": "var(--seed-duration-d4)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "enterOpacity": "0",
        "enterScale": "1.3",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      "header": {
        "gap": "var(--seed-dimension-x1_5)",
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x4)",
        "closeButtonGap": "var(--seed-dimension-x1_5)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x12)",
        "strokeDuration": "var(--seed-duration-color-transition)",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x4)",
        "paddingBottom": "var(--seed-dimension-x6)"
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
        "fromTop": "var(--seed-dimension-x7)",
        "fromRight": "var(--seed-dimension-x6)"
      }
    },
    "scrolled": {
      "body": {
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "content": {
        "maxWidth": "480px"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "content": {
        "maxWidth": "800px"
      }
    }
  }
}