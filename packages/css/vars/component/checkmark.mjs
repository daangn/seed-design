export const vars = {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)"
      }
    }
  },
  "variantSquare": {
    "enabled": {
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--ride-color-stroke-neutral-weak)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-transparent-pressed)"
      }
    },
    "enabledSelected": {
      "root": {
        "strokeWidth": "0px",
        "strokeColor": "#00000000"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--ride-color-bg-disabled)",
        "strokeColor": "var(--ride-color-stroke-neutral-muted)"
      },
      "icon": {
        "color": "var(--ride-color-fg-disabled)"
      }
    },
    "disabledSelected": {
      "icon": {
        "color": "var(--ride-color-fg-disabled)"
      }
    }
  },
  "variantSquareToneBrand": {
    "enabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--ride-color-palette-static-white)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--ride-color-bg-brand-solid-pressed)"
      }
    }
  },
  "variantSquareToneNeutral": {
    "enabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
      }
    }
  },
  "variantGhost": {
    "enabled": {
      "icon": {
        "color": "var(--ride-color-fg-placeholder)",
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "icon": {
        "color": "var(--ride-color-fg-disabled)"
      }
    },
    "disabledSelected": {
      "icon": {
        "color": "var(--ride-color-fg-disabled)"
      }
    }
  },
  "variantGhostToneBrand": {
    "enabledSelected": {
      "icon": {
        "color": "var(--ride-color-fg-brand)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--ride-color-palette-carrot-200)"
      }
    }
  },
  "variantGhostToneNeutral": {
    "enabledSelected": {
      "icon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--ride-color-palette-gray-200)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "size": "var(--ride-dimension-x5)",
        "cornerRadius": "var(--ride-radius-r1)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "size": "var(--ride-dimension-x6)",
        "cornerRadius": "var(--ride-radius-r1)"
      }
    }
  },
  "variantSquareSizeMedium": {
    "enabled": {
      "icon": {
        "size": "12px"
      }
    }
  },
  "variantSquareSizeLarge": {
    "enabled": {
      "icon": {
        "size": "14px"
      }
    }
  },
  "variantGhostSizeMedium": {
    "enabled": {
      "icon": {
        "size": "14px"
      }
    }
  },
  "variantGhostSizeLarge": {
    "enabled": {
      "icon": {
        "size": "18px"
      }
    }
  }
}