export const vars = {
  "base": {
    "rest": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    }
  },
  "variantSquare": {
    "rest": {
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)"
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
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "selectedDisabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "variantSquareToneBrand": {
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
    }
  },
  "variantSquareToneNeutral": {
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
    }
  },
  "variantGhost": {
    "rest": {
      "icon": {
        "color": "var(--seed-color-fg-placeholder)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "selectedDisabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "variantGhostToneBrand": {
    "selected": {
      "icon": {
        "color": "var(--seed-color-fg-brand)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-palette-carrot-200)"
      }
    }
  },
  "variantGhostToneNeutral": {
    "selected": {
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-palette-gray-200)"
      }
    }
  },
  "sizeMedium": {
    "rest": {
      "root": {
        "size": "var(--seed-dimension-x5)",
        "cornerRadius": "var(--seed-radius-r1)"
      }
    }
  },
  "sizeLarge": {
    "rest": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "cornerRadius": "var(--seed-radius-r1)"
      }
    }
  },
  "variantSquareSizeMedium": {
    "rest": {
      "icon": {
        "size": "12px"
      }
    }
  },
  "variantSquareSizeLarge": {
    "rest": {
      "icon": {
        "size": "14px"
      }
    }
  },
  "variantGhostSizeMedium": {
    "rest": {
      "icon": {
        "size": "14px"
      }
    }
  },
  "variantGhostSizeLarge": {
    "rest": {
      "icon": {
        "size": "18px"
      }
    }
  }
}