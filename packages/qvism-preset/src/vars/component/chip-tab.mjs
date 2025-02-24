export const vars = {
  "base": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x2)",
        "cornerRadius": "var(--seed-radius-full)",
        "minHeight": "36px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    }
  },
  "variantNeutralSolid": {
    "enabled": {
      "label": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--seed-color-bg-layer-default-pressed)"
      }
    },
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "selectedDisabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "variantBrandSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontWeight": "var(--seed-font-weight-medium)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    },
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)",
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "selectedDisabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      }
    }
  }
}