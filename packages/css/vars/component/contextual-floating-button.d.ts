export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--ride-radius-full)",
        "shadow": "var(--ride-shadow-s3)",
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)"
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
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      "progressCircle": {
        "trackColor": "var(--ride-color-palette-gray-700)",
        "rangeColor": "var(--ride-color-fg-neutral-inverted)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--ride-color-bg-disabled)"
      },
      "label": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--ride-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
      }
    }
  },
  /**
   * 시각적 부담 없이 부드럽게 액션을 유도합니다.
   */
  "variantLayer": {
    "enabled": {
      "root": {
        "color": "var(--ride-color-bg-layer-floating)"
      },
      "progressCircle": {
        "trackColor": "var(--ride-color-palette-gray-500)",
        "rangeColor": "var(--ride-color-fg-neutral)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-layer-floating-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--ride-color-bg-disabled)"
      },
      "label": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--ride-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--ride-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--ride-color-bg-layer-floating-pressed)"
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
        "paddingX": "var(--ride-dimension-x3_5)",
        "paddingY": "var(--ride-dimension-x2)",
        "gap": "var(--ride-dimension-x1)"
      },
      "label": {
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)",
        "fontWeight": "var(--ride-font-weight-medium)"
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