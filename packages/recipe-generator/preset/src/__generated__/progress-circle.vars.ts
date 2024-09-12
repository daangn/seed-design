export const vars = {
  "base": {
    "enabled": {
      "root": {},
      "track": {
        "fill": "#0017580d"
      },
      "indicator": {
        "color": "#d1d3d8"
      },
      "indicator-path": {}
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "size": "var(--seed-unit-6)"
      },
      "track": {},
      "indicator": {}
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "size": "var(--seed-unit-10)"
      },
      "track": {},
      "indicator": {}
    }
  },
  "variantIndeterminate": {
    "enabled": {
      "root": {},
      "track": {},
      "indicator": {},
      "indicator-path": {
        "headDashDuration": "1.2s",
        "tailDashDuration": "1.2s",
        "rotateDuration": "1.2s",
        "headDashTimingFunction": "cubic-bezier(0.35, 0, 0.65, 1)",
        "tailDashTimingFunction": "cubic-bezier(0.35, 0, 0.65, 0.6)",
        "rotateTimingFunction": "cubic-bezier(0.35, 0.25, 0.65, 0.75)"
      }
    }
  },
  "variantDeterminate": {
    "enabled": {
      "root": {},
      "track": {},
      "indicator": {},
      "indicator-path": {
        "transitionDuration": "0.4s",
        "transitionTimingFunction": "cubic-bezier(0, 0, 0.15, 1)"
      }
    }
  }
}