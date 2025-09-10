export const vars = {
  "base": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x8)",
        "cornerRadius": "var(--seed-radius-full)",
        "paddingX": "var(--seed-dimension-x6)",
        "paddingY": "var(--seed-dimension-x1_5)",
        "gap": "var(--seed-dimension-x1_5)",
        "minWidth": "86px",
        "colorDuration": "var(--seed-duration-d4)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-medium)",
        "color": "var(--seed-color-fg-neutral-muted)",
        "colorDuration": "var(--seed-duration-d4)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    },
    "selected": {
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-layer-default-pressed)"
      }
    },
    "disabled": {
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}