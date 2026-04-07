export const vars = {
  "base": {
    "enabled": {
      "region": {
        "paddingX": "var(--ride-dimension-x2)",
        "paddingY": "var(--ride-dimension-x2)",
        "offsetDuration": "var(--ride-duration-d4)",
        "offsetTimingFunction": "var(--ride-timing-function-easing)"
      },
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)",
        "cornerRadius": "var(--ride-radius-r2)",
        "minHeight": "44px",
        "maxWidth": "560px",
        "paddingX": "var(--ride-dimension-x2_5)",
        "paddingY": "var(--ride-dimension-x2_5)",
        "enterOpacity": "0",
        "enterScale": "0.8",
        "enterDuration": "var(--ride-duration-d3)",
        "enterTimingFunction": "var(--ride-timing-function-enter)",
        "exitOpacity": "0",
        "exitScale": "0.8",
        "exitDuration": "var(--ride-duration-d2)",
        "exitTimingFunction": "var(--ride-timing-function-exit)"
      },
      "content": {
        "paddingX": "var(--ride-dimension-x1_5)",
        "gap": "var(--ride-dimension-x2_5)"
      },
      "message": {
        "color": "var(--ride-color-fg-neutral-inverted)",
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)",
        "fontWeight": "var(--ride-font-weight-regular)"
      },
      "prefixIcon": {
        "size": "24px",
        "paddingRight": "var(--ride-dimension-x0_5)"
      },
      "actionButton": {
        "targetPaddingX": "var(--ride-dimension-x2)",
        "targetMinHeight": "44px",
        "color": "var(--ride-color-fg-brand)",
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)",
        "fontWeight": "var(--ride-font-weight-bold)"
      }
    }
  },
  "variantDefault": {},
  "variantPositive": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--ride-color-fg-positive)"
      }
    }
  },
  "variantCritical": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--ride-color-fg-critical)"
      }
    }
  }
}