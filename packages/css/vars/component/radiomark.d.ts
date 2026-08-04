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
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        "cornerRadius": "var(--seed-radius-full)"
      },
      "icon": {
        "cornerRadius": "var(--seed-radius-full)"
      }
    },
    "enabledPressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "enabledSelected": {
      "root": {
        "strokeWidth": "0px",
        "strokeColor": "#00000000"
      }
    }
  },
  "toneBrand": {
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "enabledSelectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-palette-gray-300)"
      },
      "icon": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    }
  },
  "toneNeutral": {
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "enabledSelectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    },
    "disabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-palette-gray-300)"
      },
      "icon": {
        "color": "var(--seed-color-palette-gray-300)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x5)"
      },
      "icon": {
        "size": "var(--seed-dimension-x2)"
      }
    },
    "disabled": {
      "icon": {
        "size": "var(--seed-dimension-x2_5)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)"
      },
      "icon": {
        "size": "var(--seed-dimension-x2_5)"
      }
    },
    "disabled": {
      "icon": {
        "size": "var(--seed-dimension-x3)"
      }
    }
  }
}