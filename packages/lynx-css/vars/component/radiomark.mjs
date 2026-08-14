export const vars = {
  "base": {
    "rest": {
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
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "selected": {
      "root": {
        "strokeWidth": "0px",
        "strokeColor": "#00000000"
      }
    }
  },
  "toneBrand": {
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    },
    "selectedDisabled": {
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
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    },
    "selectedDisabled": {
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
    "rest": {
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
    "rest": {
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