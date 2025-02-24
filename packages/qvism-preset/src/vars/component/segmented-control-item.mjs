export const vars = {
  "base": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x8)",
        "cornerRadius": "var(--seed-radius-full)",
        "paddingX": "var(--seed-dimension-x4)",
        "minWidth": "86px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-medium)",
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    },
    "selected": {
      "label": {
        "fontWeight": "var(--seed-font-weight-bold)",
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "disabled": {
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}