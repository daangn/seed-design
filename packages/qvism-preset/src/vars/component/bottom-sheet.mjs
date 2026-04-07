export const vars = {
  "base": {
    "enabled": {
      "backdrop": {
        "color": "var(--ride-color-bg-overlay)",
        "enterDuration": "var(--ride-duration-d6)",
        "enterTimingFunction": "var(--ride-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--ride-duration-d4)",
        "exitTimingFunction": "var(--ride-timing-function-exit)",
        "exitOpacity": "0"
      },
      "content": {
        "color": "var(--ride-color-bg-layer-floating)",
        "maxWidth": "640px",
        "topCornerRadius": "var(--ride-radius-r6)",
        "enterDuration": "var(--ride-duration-d6)",
        "enterTimingFunction": "var(--ride-timing-function-enter-expressive)",
        "exitDuration": "var(--ride-duration-d4)",
        "exitTimingFunction": "var(--ride-timing-function-exit)"
      },
      "header": {
        "gap": "var(--ride-dimension-x2)",
        "paddingTop": "var(--ride-dimension-x6)",
        "paddingBottom": "var(--ride-dimension-x4)"
      },
      "body": {
        "paddingX": "var(--ride-dimension-spacing-x-global-gutter)"
      },
      "footer": {
        "paddingX": "var(--ride-dimension-spacing-x-global-gutter)",
        "paddingTop": "var(--ride-dimension-x3)",
        "paddingBottom": "var(--ride-dimension-x4)"
      },
      "title": {
        "color": "var(--ride-color-fg-neutral)",
        "fontSize": "var(--ride-font-size-t8)",
        "lineHeight": "var(--ride-line-height-t8)",
        "fontWeight": "var(--ride-font-weight-bold)"
      },
      "description": {
        "color": "var(--ride-color-fg-neutral-muted)",
        "fontSize": "var(--ride-font-size-t5)",
        "lineHeight": "var(--ride-line-height-t5)",
        "fontWeight": "var(--ride-font-weight-regular)",
        "paddingX": "var(--ride-dimension-spacing-x-global-gutter)"
      },
      "closeButton": {
        "fromTop": "var(--ride-dimension-x6)",
        "fromRight": "var(--ride-dimension-x4)"
      }
    }
  },
  "headerAlignmentLeftCloseButtonTrue": {
    "enabled": {
      "title": {
        "paddingRight": "56px",
        "paddingLeft": "var(--ride-dimension-spacing-x-global-gutter)"
      }
    }
  },
  "headerAlignmentLeftCloseButtonFalse": {
    "enabled": {
      "title": {
        "paddingLeft": "var(--ride-dimension-spacing-x-global-gutter)",
        "paddingRight": "var(--ride-dimension-spacing-x-global-gutter)"
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
        "paddingLeft": "var(--ride-dimension-spacing-x-global-gutter)",
        "paddingRight": "var(--ride-dimension-spacing-x-global-gutter)"
      }
    }
  }
}