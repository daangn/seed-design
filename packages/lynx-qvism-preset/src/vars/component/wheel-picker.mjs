export const vars = {
  "base": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating)"
      },
      "selectionIndicator": {
        "insetX": "var(--seed-dimension-x4)",
        "cornerRadius": "var(--seed-radius-r2)",
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "scrollFog": {
        "maxHeightFraction": "0.4"
      },
      "itemLabel": {
        "paddingX": "var(--seed-dimension-x4)",
        "fontWeight": "var(--seed-font-weight-medium)",
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "selected": {
      "itemLabel": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "disabled": {
      "itemLabel": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "height": "180px"
      },
      "selectionIndicator": {
        "height": "36px"
      },
      "scrollFog": {
        "maxHeight": "108px"
      },
      "item": {
        "height": "36px"
      },
      "itemLabel": {
        "fontSize": "var(--seed-font-size-t7-static)",
        "lineHeight": "var(--seed-line-height-t7-static)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "220px"
      },
      "selectionIndicator": {
        "height": "44px"
      },
      "scrollFog": {
        "maxHeight": "132px"
      },
      "item": {
        "height": "44px"
      },
      "itemLabel": {
        "fontSize": "var(--seed-font-size-t10-static)",
        "lineHeight": "var(--seed-line-height-t10-static)"
      }
    }
  }
}