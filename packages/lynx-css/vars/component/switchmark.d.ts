export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-full)",
        "color": "var(--seed-color-palette-gray-600)",
        "colorDuration": "var(--seed-duration-d1)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "colorDelay": "20ms"
      },
      "thumb": {
        "cornerRadius": "var(--seed-radius-full)",
        "scale": "0.8",
        "scaleDuration": "var(--seed-duration-d3)",
        "scaleTimingFunction": "var(--seed-timing-function-easing)",
        "translateDuration": "var(--seed-duration-d3)",
        "translateTimingFunction": "var(--seed-timing-function-easing)",
        "colorDuration": "var(--seed-duration-d1)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "colorDelay": "20ms"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.38",
        "opacityDuration": "var(--seed-duration-d1)",
        "opacityTimingFunction": "var(--seed-timing-function-easing)"
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
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      }
    }
  },
  "toneNeutral": {
    "enabled": {
      "thumb": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      }
    },
    "disabled": {
      "thumb": {
        "color": "var(--seed-color-palette-static-black-alpha-700)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--seed-color-palette-gray-600)"
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