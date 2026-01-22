export const vars = {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    }
  },
  "variantSquare": {
    "enabled": {
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
    "enabledSelected": {
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
    "disabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "variantSquareToneBrand": {
    "enabledSelected": {
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
    "enabledSelected": {
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
    "enabled": {
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
    "disabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "variantGhostToneBrand": {
    "enabledSelected": {
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
    "enabledSelected": {
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
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x5)",
        "cornerRadius": "var(--seed-radius-r1)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "cornerRadius": "var(--seed-radius-r1)"
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