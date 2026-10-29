export const vars = {
  "base": {
    "enabled": {
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        "strokeDuration": "0.1s",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "value": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-placeholder)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "maskedPlaceholder": {
        "color": "var(--seed-color-fg-placeholder)"
      },
      "separator": {
        "color": "var(--seed-color-fg-placeholder)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "staticText": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)"
      }
    },
    "focused": {
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-neutral-contrast)"
      }
    },
    "invalid": {
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "invalidFocused": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "readonly": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "value": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "maskedPlaceholder": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "separator": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "staticText": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)",
        "minHeight": "var(--seed-dimension-x13)",
        "cornerRadius": "var(--seed-radius-r3)",
        "paddingX": "var(--seed-dimension-x4)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "separator": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "staticText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2)",
        "minHeight": "var(--seed-dimension-x10)",
        "cornerRadius": "var(--seed-radius-r2)",
        "paddingX": "var(--seed-dimension-x3_5)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "separator": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "staticText": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  }
}