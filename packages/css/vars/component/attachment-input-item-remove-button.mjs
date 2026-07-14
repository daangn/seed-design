export const vars = {
  "base": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x5)",
        "cornerRadius": "var(--seed-radius-full)",
        "color": "var(--seed-color-bg-layer-default)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        "offset": "var(--seed-dimension-x1)",
        "scaleDuration": "var(--seed-duration-pressed-scale)",
        "scaleTimingFunction": "var(--seed-timing-function-pressed-scale)"
      },
      "icon": {
        "size": "var(--seed-dimension-x2_5)",
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-layer-default-pressed)",
        "scale": "var(--seed-scale-s95)"
      }
    },
    "disabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}