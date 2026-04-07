export const vars = {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)",
        "strokeWidth": "1px",
        "strokeColor": "var(--ride-color-stroke-neutral-weak)",
        "cornerRadius": "var(--ride-radius-full)"
      },
      "icon": {
        "cornerRadius": "var(--ride-radius-full)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--ride-color-bg-transparent-pressed)"
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
        "color": "var(--ride-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--ride-color-palette-static-white)"
      }
    },
    "enabledSelectedPressed": {
      "root": {
        "color": "var(--ride-color-bg-brand-solid-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--ride-color-palette-gray-300)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-transparent)",
        "strokeWidth": "1px",
        "strokeColor": "var(--ride-color-palette-gray-300)"
      },
      "icon": {
        "color": "var(--ride-color-palette-gray-300)"
      }
    }
  },
  "toneNeutral": {
    "enabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "enabledSelectedPressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--ride-color-palette-gray-300)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-transparent)",
        "strokeWidth": "1px",
        "strokeColor": "var(--ride-color-palette-gray-300)"
      },
      "icon": {
        "color": "var(--ride-color-palette-gray-300)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "size": "var(--ride-dimension-x5)"
      },
      "icon": {
        "size": "var(--ride-dimension-x2)"
      }
    },
    "disabled": {
      "icon": {
        "size": "var(--ride-dimension-x2_5)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "size": "var(--ride-dimension-x6)"
      },
      "icon": {
        "size": "var(--ride-dimension-x2_5)"
      }
    },
    "disabled": {
      "icon": {
        "size": "var(--ride-dimension-x3)"
      }
    }
  }
}