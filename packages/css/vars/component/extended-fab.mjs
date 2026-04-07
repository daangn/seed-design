export const vars = {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--ride-radius-full)",
        "shadow": "0px 2px 6px 0px #00000026"
      }
    }
  },
  "variantNeutralSolid": {
    "enabled": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
      }
    }
  },
  "variantLayerFloating": {
    "enabled": {
      "root": {
        "color": "var(--ride-color-bg-layer-floating)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-layer-floating-pressed)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "minHeight": "40px",
        "gap": "var(--ride-dimension-x1)",
        "paddingX": "var(--ride-dimension-x3_5)",
        "paddingY": "var(--ride-dimension-x2_5)"
      },
      "prefixIcon": {
        "size": "16px"
      },
      "label": {
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)",
        "fontWeight": "var(--ride-font-weight-medium)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "minHeight": "48px",
        "gap": "var(--ride-dimension-x1)",
        "paddingX": "var(--ride-dimension-x4)",
        "paddingY": "var(--ride-dimension-x3)"
      },
      "prefixIcon": {
        "size": "16px"
      },
      "label": {
        "fontSize": "var(--ride-font-size-t5)",
        "lineHeight": "var(--ride-line-height-t5)",
        "fontWeight": "var(--ride-font-weight-bold)"
      }
    }
  }
}