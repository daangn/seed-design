export const vars = {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-full)",
        "shadow": "var(--seed-shadow-s3)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "progressCircle": {
        "size": "16px",
        "thickness": "2px"
      }
    }
  },
  "variantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-700)",
        "rangeColor": "var(--seed-color-fg-neutral-inverted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    }
  },
  "variantLayer": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-500)",
        "rangeColor": "var(--seed-color-fg-neutral)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating-pressed)"
      }
    }
  },
  "layoutWithText": {
    "enabled": {
      "root": {
        "minHeight": "36px",
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x2)",
        "gap": "var(--seed-dimension-x1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "prefixIcon": {
        "size": "16px"
      }
    }
  },
  "layoutIconOnly": {
    "enabled": {
      "root": {
        "size": "44px"
      },
      "icon": {
        "size": "22px"
      }
    }
  }
}