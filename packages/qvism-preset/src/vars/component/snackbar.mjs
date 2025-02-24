export const vars = {
  "base": {
    "enabled": {
      "region": {
        "paddingX": "var(--seed-dimension-x2)",
        "paddingY": "var(--seed-dimension-x2)",
        "offsetDuration": "var(--seed-duration-d4)",
        "offsetTimingFunction": "var(--seed-timing-function-easing)"
      },
      "root": {
        "color": "var(--seed-color-bg-neutral-solid)",
        "cornerRadius": "var(--seed-radius-r2)",
        "minHeight": "44px",
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2_5)",
        "gap": "var(--seed-dimension-x2)",
        "enterOpacity": "0",
        "enterDuration": "var(--seed-duration-d4)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "exitOpacity": "0",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-exit)"
      },
      "message": {
        "color": "var(--seed-color-palette-static-white)",
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "prefixIcon": {
        "size": "24px"
      },
      "actionButton": {
        "targetPaddingX": "var(--seed-dimension-x2)",
        "targetMinHeight": "44px",
        "color": "var(--seed-color-fg-brand)",
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    }
  },
  "variantDefault": {},
  "variantPositive": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-positive)"
      }
    }
  },
  "variantCritical": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-critical)"
      }
    }
  }
}