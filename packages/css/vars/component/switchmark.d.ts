export declare const vars: {
  "base": {
    "enabled": {
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "cornerRadius": "var(--seed-radius-full)",
        "color": "var(--seed-color-palette-gray-600)",
        "colorDuration": "var(--seed-duration-d1)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "colorDelay": "20ms"
      },
      "thumb": {
        "cornerRadius": "var(--seed-radius-full)",
        /** selected 여부에 따른 thumb 크기입니다. pressed 축소는 root에 적용되므로 이 값과 무관합니다. */
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
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "opacity": "0.38",
        "opacityDuration": "var(--seed-duration-d1)",
        "opacityTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "selected": {
      "thumb": {
        /** selected 여부에 따른 thumb 크기입니다. pressed 축소는 root에 적용되므로 이 값과 무관합니다. */
        "scale": "1"
      }
    }
  },
  "toneBrand": {
    "enabled": {
      "thumb": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "enabledSelected": {
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "color": "var(--seed-color-palette-gray-600)"
      }
    }
  },
  "size32": {
    "enabled": {
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 thumb를 포함한 root 전체가 축소됩니다. 누르는 영역은 Switch root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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