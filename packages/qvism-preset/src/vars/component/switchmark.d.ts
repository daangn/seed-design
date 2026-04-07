export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--ride-radius-full)",
        "color": "var(--ride-color-palette-gray-600)",
        "colorDuration": "var(--ride-duration-d1)",
        "colorTimingFunction": "var(--ride-timing-function-easing)",
        "colorDelay": "20ms"
      },
      "thumb": {
        "cornerRadius": "var(--ride-radius-full)",
        "scale": "0.8",
        "scaleDuration": "var(--ride-duration-d3)",
        "scaleTimingFunction": "var(--ride-timing-function-easing)",
        "translateDuration": "var(--ride-duration-d3)",
        "translateTimingFunction": "var(--ride-timing-function-easing)",
        "colorDuration": "var(--ride-duration-d1)",
        "colorTimingFunction": "var(--ride-timing-function-easing)",
        "colorDelay": "20ms"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.38",
        "opacityDuration": "var(--ride-duration-d1)",
        "opacityTimingFunction": "var(--ride-timing-function-easing)"
      }
    },
    "selected": {
      "thumb": {
        "scale": "1"
      }
    }
  },
  /**
   * [deprecated] 주요 버튼 등의 핵심 액션과 시각적으로 충돌하기에 더 이상 사용하지 않습니다.
   */
  "toneBrand": {
    "enabled": {
      "thumb": {
        "color": "var(--ride-color-palette-static-white)"
      }
    },
    "enabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-brand-solid)"
      }
    }
  },
  "toneNeutral": {
    "enabled": {
      "thumb": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "enabledSelected": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)"
      }
    },
    "disabled": {
      "thumb": {
        "color": "var(--ride-color-palette-static-black-alpha-700)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--ride-color-palette-gray-600)"
      }
    }
  },
  "size32": {
    "enabled": {
      "root": {
        "height": "32px",
        "width": "52px",
        "paddingX": "3px",
        "paddingY": "3px"
      },
      "thumb": {
        "height": "26px",
        "width": "26px"
      }
    }
  },
  "size24": {
    "enabled": {
      "root": {
        "height": "24px",
        "width": "38px",
        "paddingX": "2px",
        "paddingY": "2px"
      },
      "thumb": {
        "height": "20px",
        "width": "20px"
      }
    }
  },
  "size16": {
    "enabled": {
      "root": {
        "height": "16px",
        "width": "26px",
        "paddingX": "2px",
        "paddingY": "2px"
      },
      "thumb": {
        "height": "12px",
        "width": "12px"
      }
    }
  }
}