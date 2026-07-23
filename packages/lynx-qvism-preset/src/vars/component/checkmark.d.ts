export declare const vars: {
  "base": {
    "enabled": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)"
      }
    },
    "pressed": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "enabledSelected": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "strokeWidth": "0px",
        "strokeColor": "#00000000"
      }
    },
    "disabled": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
   */
  "variantSquareToneBrand": {
    "enabledSelected": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "pressedSelected": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "pressedSelected": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
   */
  "variantGhostToneBrand": {
    "enabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-brand)"
      }
    },
    "pressedSelected": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "color": "var(--seed-color-palette-gray-200)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
      "root": {
        "size": "var(--seed-dimension-x5)",
        "cornerRadius": "var(--seed-radius-r1)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      /** pressed 시 root가 축소됩니다. 누르는 영역은 Checkbox root 전체이지만 축소되는 것은 이 슬롯뿐입니다. 감싸는 컴포넌트가 이미 자체 pressed 피드백을 주는 경우(List Item 등)에는 축소되지 않습니다. */
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