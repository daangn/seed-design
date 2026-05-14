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
   * 브랜드의 핵심 가치를 전달하며, 사용자 간 연결이 일어나는 서비스의 주요 기능에 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다.
   */
  "variantBrandSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-palette-static-white)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
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
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    }
  },
  /**
   * 대부분의 화면에서 CTA로 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다.
   */
  "variantNeutralSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-static-white-alpha-300)",
        "rangeColor": "var(--seed-color-palette-static-white)"
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
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
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
   * CTA를 제외한 대부분의 액션에 사용됩니다.
   */
  "variantNeutralWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
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
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    }
  },
  /**
   * 삭제나 초기화처럼 되돌릴 수 없는 중요한 작업에 사용합니다.
   */
  "variantCriticalSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-critical-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-palette-static-white)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-palette-static-white)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
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
        "color": "var(--seed-color-bg-critical-solid-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-critical-solid-pressed)"
      }
    }
  },
  /**
   * variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=brandOutline과 조합하여 사용하는 것을 권장합니다.
   */
  "variantNeutralOutline": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
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
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-transparent)"
      }
    }
  },
  /**
   * variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=neutralOutline과 조합하여 사용하는 것을 권장합니다.
   */
  "variantBrandOutline": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--seed-color-fg-brand)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-brand)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-brand)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-brand)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-carrot-200)",
        "rangeColor": "var(--seed-color-bg-brand-solid)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-transparent)"
      }
    }
  },
  /**
   * 배경 없이 텍스트와 아이콘만 표시됩니다. 모두 동일한 색상을 사용하는 조건에서 icon, prefix icon, suffix icon, label에 정의된 color를 변경할 수 있으며, label의 fontWeight를 `$font-weight.regular` 또는 `$font-weight.medium`으로 변경하여 주목도를 조절할 수 있습니다.
   */
  "variantGhost": {
    "enabled": {
      "root": {
        "color": "#ffffff00"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
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
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "#ffffff00"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "loading": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    }
  },
  /**
   * 작은 공간에서 효율적으로 사용할 수 있는 Pill 형태로 제공됩니다.
   */
  "sizeXsmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x8)",
        "cornerRadius": "var(--seed-radius-full)"
      },
      "progressCircle": {
        "size": "14px",
        "thickness": "2px"
      }
    }
  },
  /**
   * - `size=xsmall`: 작은 공간에서 효율적으로 사용할 수 있는 Pill 형태로 제공됩니다.
   * - `layout=withText`: 텍스트와 함께 아이콘을 표시할 수 있습니다.
   */
  "sizeXsmallLayoutWithText": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x1)",
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x1_5)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      }
    }
  },
  /**
   * - `size=xsmall`: 작은 공간에서 효율적으로 사용할 수 있는 Pill 형태로 제공됩니다.
   * - `layout=iconOnly`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
   */
  "sizeXsmallLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x8)",
        "paddingX": "var(--seed-dimension-x1_5)",
        "paddingY": "var(--seed-dimension-x1_5)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "size": "var(--seed-dimension-x3_5)"
      }
    }
  },
  /**
   * 화면 중앙에서 범용적으로 사용됩니다.
   */
  "sizeSmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x9)",
        "cornerRadius": "var(--seed-radius-r2)"
      },
      "progressCircle": {
        "size": "14px",
        "thickness": "2px"
      }
    }
  },
  /**
   * - `size=small`: 화면 중앙에서 범용적으로 사용됩니다.
   * - `layout=withText`: 텍스트와 함께 아이콘을 표시할 수 있습니다.
   */
  "sizeSmallLayoutWithText": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x1)",
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x2)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  },
  /**
   * - `size=small`: 화면 중앙에서 범용적으로 사용됩니다.
   * - `layout=iconOnly`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
   */
  "sizeSmallLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x9)",
        "paddingX": "var(--seed-dimension-x2)",
        "paddingY": "var(--seed-dimension-x2)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "size": "var(--seed-dimension-x4)"
      }
    }
  },
  /**
   * 화면 중앙에서 범용적으로 사용됩니다.
   */
  "sizeMedium": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x10)",
        "cornerRadius": "var(--seed-radius-r2)"
      },
      "progressCircle": {
        "size": "16px",
        "thickness": "2px"
      }
    }
  },
  /**
   * - `size=medium`: 화면 중앙에서 범용적으로 사용됩니다.
   * - `layout=withText`: 텍스트와 함께 아이콘을 표시할 수 있습니다.
   */
  "sizeMediumLayoutWithText": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x1_5)",
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2_5)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  },
  /**
   * - `size=medium`: 화면 중앙에서 범용적으로 사용됩니다.
   * - `layout=iconOnly`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
   */
  "sizeMediumLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x10)",
        "paddingX": "var(--seed-dimension-x2_5)",
        "paddingY": "var(--seed-dimension-x2_5)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "size": "18px"
      }
    }
  },
  /**
   * 주로 CTA 역할로 사용됩니다.
   */
  "sizeLarge": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x13)",
        "cornerRadius": "var(--seed-radius-r3)"
      },
      "progressCircle": {
        "size": "18px",
        "thickness": "2px"
      }
    }
  },
  /**
   * - `size=large`: 주로 CTA 역할로 사용됩니다.
   * - `layout=withText`: 텍스트와 함께 아이콘을 표시할 수 있습니다.
   */
  "sizeLargeLayoutWithText": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2)",
        "paddingX": "var(--seed-dimension-x5)",
        "paddingY": "var(--seed-dimension-x3_5)"
      },
      /** 주로 액션의 의미를 보조합니다. suffixIcon과 함께 사용할 수 없습니다. */
      "prefixIcon": {
        "size": "22px"
      },
      /** Chevron처럼 동작을 보조하는 역할입니다. prefixIcon과 함께 사용할 수 없습니다. */
      "suffixIcon": {
        "size": "22px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)"
      }
    }
  },
  /**
   * - `size=large`: 주로 CTA 역할로 사용됩니다.
   * - `layout=iconOnly`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
   */
  "sizeLargeLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x13)",
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x3_5)"
      },
      /** layout=iconOnly에서 사용되는 아이콘 슬롯입니다. */
      "icon": {
        "size": "22px"
      }
    }
  }
}