export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-full)",
        "shadow": "var(--seed-shadow-s3)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "progressCircle": {
        "size": "16px",
        "thickness": "2px"
      }
    }
  },
  /**
   * 배경과 대비되는 강조된 보조 액션으로 중요도 높은 행동 유도 시 적합합니다.
   */
  "variantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-700)",
        "rangeColor": "var(--seed-color-fg-neutral-inverted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    }
  },
  /**
   * 시각적 부담 없이 부드럽게 액션을 유도합니다.
   */
  "variantLayer": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-500)",
        "rangeColor": "var(--seed-color-fg-neutral)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-layer-floating-pressed)"
      }
    }
  },
  /**
   * label과 prefixIcon을 함께 표시합니다.
   */
  "layoutWithText": {
    "enabled": {
      "root": {
        "minHeight": "36px",
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x2)",
        "gap": "var(--seed-dimension-x1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "prefixIcon": {
        "size": "16px"
      }
    }
  },
  /**
   * icon만 표시합니다. 아이콘만으로 의미를 전달하기 때문에 접근성 레이블과 함께 사용해야 합니다.
   */
  "layoutIconOnly": {
    "enabled": {
      "root": {
        "size": "44px"
      },
      "icon": {
        "size": "22px"
      }
    }
  }
}