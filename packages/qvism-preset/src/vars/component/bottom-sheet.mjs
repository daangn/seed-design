export const vars = {
  "base": {
    "enabled": {
      "backdrop": {
        "color": "var(--seed-color-bg-overlay)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "maxWidth": "640px",
        "topCornerRadius": "var(--seed-radius-r6)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-exit)"
      },
      "header": {
        "gap": "var(--seed-dimension-x2)",
        "paddingTop": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x4)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingTop": "var(--seed-dimension-x3)",
        "paddingBottom": "var(--seed-dimension-x4)"
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
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)"
      },
      "closeButton": {
        "fromTop": "var(--seed-dimension-x6)",
        "fromRight": "var(--seed-dimension-x4)"
      }
    }
  },
  "headerAlignmentLeftCloseButtonTrue": {
    "enabled": {
      "title": {
        "paddingRight": "56px",
        "paddingLeft": "var(--seed-dimension-spacing-x-global-gutter)"
      }
    }
  },
  "headerAlignmentLeftCloseButtonFalse": {
    "enabled": {
      "title": {
        "paddingLeft": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingRight": "var(--seed-dimension-spacing-x-global-gutter)"
      }
    }
  },
  "headerAlignmentCenterCloseButtonTrue": {
    "enabled": {
      "title": {
        "paddingLeft": "56px",
        "paddingRight": "56px"
      }
    }
  },
  "headerAlignmentCenterCloseButtonFalse": {
    "enabled": {
      "title": {
        "paddingLeft": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingRight": "var(--seed-dimension-spacing-x-global-gutter)"
      }
    }
  }
}