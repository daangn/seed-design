export const vars = {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        "cornerRadius": "var(--seed-radius-full)"
      },
      "icon": {
        "cornerRadius": "var(--seed-radius-full)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "enabledSelected": {
      "root": {
        "strokeWidth": "0px",
        "strokeColor": "#00000000"
      }
    }
  },
  "toneBrand": {
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "enabledSelectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-palette-gray-300)"
      },
      "icon": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    }
  },
  "toneNeutral": {
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "enabledSelectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-palette-gray-300)"
      },
      "icon": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x5)"
      },
      "icon": {
        "size": "var(--seed-dimension-x2)"
      }
    },
    "disabled": {
      "icon": {
        "size": "var(--seed-dimension-x2_5)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)"
      },
      "icon": {
        "size": "var(--seed-dimension-x2_5)"
      }
    },
    "disabled": {
      "icon": {
        "size": "var(--seed-dimension-x3)"
      }
    }
  }
}