/**
 * SEED가 컴포넌트 스타일을 만들 때 쓰는 내부 값입니다. 공개 API가 아닙니다.
 * minor·patch 업그레이드만으로도 이름이나 구조가 바뀔 수 있습니다.
 * 개별 컴포넌트의 스타일이 필요하면 `recipes/*`를, 값이 필요하면 디자인 토큰(`vars/*`)을 쓰세요.
 *
 * @internal
 */
export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "label": {
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    }
  },
  /**
   * 브랜드 컬러로 강조된 스타일입니다.
   */
  "variantBrandSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-palette-static-white)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-palette-static-white)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-static-white-alpha-300)",
        "rangeColor": "var(--seed-color-palette-static-white)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    },
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-500)",
        "rangeColor": "var(--seed-color-fg-neutral)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
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
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    },
    "selectedLoading": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    }
  },
  /**
   * 기본적인 토글 스타일입니다.
   */
  "variantNeutralWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-500)",
        "rangeColor": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    },
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-gray-500)",
        "rangeColor": "var(--seed-color-fg-neutral)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
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
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    },
    "selectedLoading": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    }
  },
  "sizeXsmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x8)",
        "cornerRadius": "var(--seed-radius-full)",
        "gap": "var(--seed-dimension-x1)",
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x1_5)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "progressCircle": {
        "size": "14px",
        "thickness": "2px"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x9)",
        "cornerRadius": "var(--seed-radius-full)",
        "gap": "var(--seed-dimension-x1)",
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "progressCircle": {
        "size": "14px",
        "thickness": "2px"
      }
    }
  }
}