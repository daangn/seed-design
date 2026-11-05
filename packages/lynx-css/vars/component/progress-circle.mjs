export const vars = {
  "size40": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x10)",
        "thickness": "5px"
      }
    }
  },
  "size24": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "thickness": "3px"
      }
    }
  },
  "indeterminateFalse": {
    "enabled": {
      "range": {
        "lengthDuration": "300ms",
        "lengthTimingFunction": "cubic-bezier(0, 0, 0.15, 1)"
      }
    }
  },
  "indeterminateTrue": {
    "enabled": {
      "range": {
        "lengthDuration": "1.2s",
        "rotateDuration": "1.2s",
        "headTimingFunction": "cubic-bezier(0.35, 0, 0.65, 1)",
        "tailTimingFunction": "cubic-bezier(0.35, 0, 0.65, 0.6)",
        "rotateTimingFunction": "cubic-bezier(0.35, 0.25, 0.65, 0.75)"
      }
    }
  },
  "toneNeutral": {
    "enabled": {
      "track": {
        "color": "var(--seed-color-palette-gray-200)"
      },
      "range": {
        "color": "var(--seed-color-palette-gray-500)"
      }
    }
  },
  "toneBrand": {
    "enabled": {
      "track": {
        "color": "var(--seed-color-palette-carrot-200)"
      },
      "range": {
        "color": "var(--seed-color-bg-brand-solid)"
      }
    }
  },
  "toneStaticWhite": {
    "enabled": {
      "track": {
        "color": "var(--seed-color-palette-static-white-alpha-300)"
      },
      "range": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  }
}