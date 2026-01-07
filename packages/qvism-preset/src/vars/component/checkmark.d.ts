export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    }
  },
  /**
   * 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.
   */
  "variantSquare": {
    "enabled": {
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "enabledSelected": {
      "root": {
        "strokeWidth": "0px",
        "strokeColor": "#00000000"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "disabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  /**
   * - `variant=square`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.
   * - `tone=brand`: [deprecated] 주요 버튼 등의 핵심 액션과 시각적으로 충돌하기에 더 이상 사용하지 않습니다.
   */
  "variantSquareToneBrand": {
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    }
  },
  /**
   * - `variant=square`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.
   */
  "variantSquareToneNeutral": {
    "enabledSelected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    }
  },
  /**
   * 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
   */
  "variantGhost": {
    "enabled": {
      "icon": {
        "color": "var(--seed-color-fg-placeholder)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "disabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  /**
   * - `variant=ghost`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
   * - `tone=brand`: [deprecated] 주요 버튼 등의 핵심 액션과 시각적으로 충돌하기에 더 이상 사용하지 않습니다.
   */
  "variantGhostToneBrand": {
    "enabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-brand)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-palette-carrot-200)"
      }
    }
  },
  /**
   * - `variant=ghost`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
   */
  "variantGhostToneNeutral": {
    "enabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressedSelected": {
      "root": {
        "color": "var(--seed-color-palette-gray-200)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x5)",
        "cornerRadius": "var(--seed-radius-r1)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "cornerRadius": "var(--seed-radius-r1)"
      }
    }
  },
  /**
   * - `variant=square`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.
   */
  "variantSquareSizeMedium": {
    "enabled": {
      "icon": {
        "size": "12px"
      }
    }
  },
  /**
   * - `variant=square`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.
   */
  "variantSquareSizeLarge": {
    "enabled": {
      "icon": {
        "size": "14px"
      }
    }
  },
  /**
   * - `variant=ghost`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
   */
  "variantGhostSizeMedium": {
    "enabled": {
      "icon": {
        "size": "14px"
      }
    }
  },
  /**
   * - `variant=ghost`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
   */
  "variantGhostSizeLarge": {
    "enabled": {
      "icon": {
        "size": "18px"
      }
    }
  }
}