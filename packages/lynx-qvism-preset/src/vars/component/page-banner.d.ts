export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2_5)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)",
        "marginRight": "var(--seed-dimension-x2)"
      },
      /** title, description과 button을 감싸는 컨테이너입니다. button은 title과 description 오른쪽에 놓이고, 한 줄에 들어가지 않으면 그 아래 줄로 내려갑니다. */
      "content": {
        "gap": "var(--seed-dimension-x1_5)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "button": {
        "targetHeight": "var(--seed-dimension-x10)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "size": "var(--seed-dimension-x4)",
        "marginLeft": "var(--seed-dimension-x2)"
      }
    }
  },
  /**
   * - `variant=weak`: 배경색이 연한 스타일입니다.
   */
  "toneNeutralVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "button": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    }
  },
  /**
   * - `variant=solid`: 배경색이 진한 스타일입니다.
   */
  "toneNeutralVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-solid)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-on-neutral-solid)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-on-neutral-solid)"
      },
      "description": {
        "color": "var(--seed-color-fg-on-neutral-solid)"
      },
      "button": {
        "color": "var(--seed-color-fg-on-neutral-solid)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-on-neutral-solid)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-solid-pressed)"
      }
    }
  },
  /**
   * - `variant=weak`: 배경색이 연한 스타일입니다.
   */
  "tonePositiveVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-positive-weak)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-positive-contrast)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-positive-contrast)"
      },
      "description": {
        "color": "var(--seed-color-fg-positive-contrast)"
      },
      "button": {
        "color": "var(--seed-color-fg-positive-contrast)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-positive-contrast)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-positive-weak-pressed)"
      }
    }
  },
  /**
   * - `variant=solid`: 배경색이 진한 스타일입니다.
   */
  "tonePositiveVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-positive-solid)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-on-positive-solid)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-on-positive-solid)"
      },
      "description": {
        "color": "var(--seed-color-fg-on-positive-solid)"
      },
      "button": {
        "color": "var(--seed-color-fg-on-positive-solid)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-on-positive-solid)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-positive-solid-pressed)"
      }
    }
  },
  /**
   * - `variant=weak`: 배경색이 연한 스타일입니다.
   */
  "toneInformativeVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-informative-weak)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-informative-contrast)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-informative-contrast)"
      },
      "description": {
        "color": "var(--seed-color-fg-informative-contrast)"
      },
      "button": {
        "color": "var(--seed-color-fg-informative-contrast)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-informative-contrast)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-informative-weak-pressed)"
      }
    }
  },
  /**
   * - `variant=solid`: 배경색이 진한 스타일입니다.
   */
  "toneInformativeVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-informative-solid)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-on-informative-solid)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-on-informative-solid)"
      },
      "description": {
        "color": "var(--seed-color-fg-on-informative-solid)"
      },
      "button": {
        "color": "var(--seed-color-fg-on-informative-solid)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-on-informative-solid)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-informative-solid-pressed)"
      }
    }
  },
  /**
   * - `variant=weak`: 배경색이 연한 스타일입니다.
   */
  "toneWarningVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-warning-weak)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-warning-contrast)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-warning-contrast)"
      },
      "description": {
        "color": "var(--seed-color-fg-warning-contrast)"
      },
      "button": {
        "color": "var(--seed-color-fg-warning-contrast)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-warning-contrast)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-warning-weak-pressed)"
      }
    }
  },
  /**
   * - `variant=solid`: 배경색이 진한 스타일입니다.
   */
  "toneWarningVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-warning-solid)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-on-warning-solid)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-on-warning-solid)"
      },
      "description": {
        "color": "var(--seed-color-fg-on-warning-solid)"
      },
      "button": {
        "color": "var(--seed-color-fg-on-warning-solid)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-on-warning-solid)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-warning-solid-pressed)"
      }
    }
  },
  /**
   * - `variant=weak`: 배경색이 연한 스타일입니다.
   */
  "toneCriticalVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-critical-weak)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-critical-contrast)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-critical-contrast)"
      },
      "description": {
        "color": "var(--seed-color-fg-critical-contrast)"
      },
      "button": {
        "color": "var(--seed-color-fg-critical-contrast)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-critical-contrast)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-critical-weak-pressed)"
      }
    }
  },
  /**
   * - `variant=solid`: 배경색이 진한 스타일입니다.
   */
  "toneCriticalVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-critical-solid)"
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-on-critical-solid)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-on-critical-solid)"
      },
      "description": {
        "color": "var(--seed-color-fg-on-critical-solid)"
      },
      "button": {
        "color": "var(--seed-color-fg-on-critical-solid)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-on-critical-solid)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-critical-solid-pressed)"
      }
    }
  },
  /**
   * - `tone=magic`: AI 기능을 나타냅니다. variant=solid와 조합하여 사용하지 않습니다.
   * - `variant=weak`: 배경색이 연한 스타일입니다.
   */
  "toneMagicVariantWeak": {
    "enabled": {
      "root": {
        "gradient": {
          "serialized": "var(--seed-gradient-glow-magic)"
        }
      },
      /** 아이콘은 Fill 타입 사용을 권장합니다. root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** description과 줄을 나누지 않고 이어서 표시합니다. */
      "title": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "button": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** root가 클릭 영역인 Actionable Page Banner에서 사용합니다. prefixIcon과 같이 root의 세로 가운데가 아니라 title과 description 첫 줄의 세로 가운데에 맞춥니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "gradient": {
          "serialized": "var(--seed-gradient-glow-magic-pressed)"
        }
      }
    }
  }
}