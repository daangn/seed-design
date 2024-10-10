export const vars = {
  "base": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral)",
        "strokeWidth": "1px",
        "cornerRadius": "var(--seed-radii-full)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "prefix": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffix": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "count": {
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-layer-default-pressed)"
      }
    },
    "selected": {
      "root": {
        "strokeWidth": 0,
        "color": "var(--seed-color-bg-brand-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-brand)"
      },
      "prefix": {
        "color": "var(--seed-color-fg-brand)"
      },
      "suffix": {
        "color": "var(--seed-color-fg-brand)"
      },
      "count": {
        "color": "var(--seed-color-fg-brand)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-brand-weak-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefix": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffix": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "count": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-unit-8)",
        "paddingY": "var(--seed-unit-1\\.5)",
        "gap": "var(--seed-unit-1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-100)"
      },
      "prefix": {
        "size": "var(--seed-unit-4)"
      },
      "suffix": {
        "size": "var(--seed-unit-4)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-unit-9)",
        "paddingY": "var(--seed-unit-2)",
        "gap": "var(--seed-unit-1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-100)"
      },
      "prefix": {
        "size": "var(--seed-unit-4)"
      },
      "suffix": {
        "size": "var(--seed-unit-4)"
      }
    }
  },
  "sizeSmallLayoutWithText": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-unit-3)"
      }
    }
  },
  "sizeSmallLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-unit-8)"
      },
      "icon": {
        "size": "var(--seed-unit-4)"
      }
    }
  },
  "sizeMediumLayoutWithText": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-unit-3\\.5)"
      }
    }
  },
  "sizeMediumLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-unit-9)"
      },
      "icon": {
        "size": "var(--seed-unit-4)"
      }
    }
  }
}