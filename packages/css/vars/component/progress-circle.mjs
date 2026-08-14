export const vars = {
  "size40": {
    "rest": {
      "root": {
        "size": "var(--seed-dimension-x10)",
        "thickness": "5px"
      }
    }
  },
  "size24": {
    "rest": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "thickness": "3px"
      }
    }
  },
  "indeterminateFalse": {
    "rest": {
      "range": {
        "lengthDuration": "300ms",
        "lengthTimingFunction": "cubic-bezier(0, 0, 0.15, 1)"
      }
    }
  },
  "indeterminateTrue": {
    "rest": {
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
    "rest": {
      "track": {
        "color": "var(--seed-color-palette-gray-200)"
      },
      "range": {
        "color": "var(--seed-color-palette-gray-500)"
      }
    }
  },
  "toneBrand": {
    "rest": {
      "track": {
        "color": "var(--seed-color-palette-carrot-200)"
      },
      "range": {
        "color": "var(--seed-color-bg-brand-solid)"
      }
    }
  },
  "toneStaticWhite": {
    "rest": {
      "track": {
        "color": "var(--seed-color-palette-static-white-alpha-300)"
      },
      "range": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  }
}