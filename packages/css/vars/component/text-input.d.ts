export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        /** enabled 상태의 stroke 위에 focused/invalid 상태의 stroke가 fade in/out 되는 데에 걸리는 시간입니다. stroke 두께나 색상 자체를 transition하지 않습니다. */
        "strokeDuration": "0.1s",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "value": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-placeholder)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "prefixText": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "suffixText": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    },
    "focused": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-contrast)"
      }
    },
    "invalid": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "invalidFocused": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "disabled": {
      "value": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixText": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixText": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  /**
   * 기본 스타일입니다.
   */
  "variantOutline": {
    "enabled": {
      "root": {
        "strokeWidth": "1px"
      }
    },
    "focused": {
      "root": {
        "strokeWidth": "2px"
      }
    },
    "invalid": {
      "root": {
        "strokeWidth": "2px"
      }
    },
    "readonly": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)"
      }
    }
  },
  /**
   * - `variant=outline`: 기본 스타일입니다.
   * - `size=large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "variantOutlineSizeLarge": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)",
        "minHeight": "var(--seed-dimension-x13)",
        "cornerRadius": "var(--seed-radius-r3)",
        "paddingX": "var(--seed-dimension-x4)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x5)"
      },
      "suffixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)"
      }
    }
  },
  /**
   * - `variant=outline`: 기본 스타일입니다.
   * - `size=medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "variantOutlineSizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2)",
        "minHeight": "var(--seed-dimension-x10)",
        "cornerRadius": "var(--seed-radius-r2)",
        "paddingX": "var(--seed-dimension-x3_5)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "suffixText": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x4)"
      }
    }
  },
  /**
   * 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
   */
  "variantUnderline": {
    "enabled": {
      "root": {
        "strokeBottomWidth": "1px"
      }
    },
    "focused": {
      "root": {
        "strokeBottomWidth": "2px"
      }
    },
    "invalid": {
      "root": {
        "strokeBottomWidth": "2px"
      }
    },
    "readonly": {
      "value": {
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "placeholder": {
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    }
  },
  /**
   * - `variant=underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
   * - `size=large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "variantUnderlineSizeLarge": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)",
        "minHeight": "var(--seed-dimension-x10)",
        "paddingY": "var(--seed-dimension-x2)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x6)"
      },
      "suffixText": {
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x6)"
      }
    }
  },
  /**
   * - `variant=underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
   * - `size=medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "variantUnderlineSizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2)",
        "minHeight": "34px",
        "paddingY": "var(--seed-dimension-x1_5)"
      },
      "value": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "placeholder": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "prefixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x5)"
      },
      "suffixText": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)"
      }
    }
  },
  "typeSingleline": {},
  /**
   * - `size=large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "typeMultilineSizeLarge": {
    "enabled": {
      "root": {
        "minHeight": "95px",
        "paddingY": "var(--seed-dimension-x3_5)"
      }
    }
  },
  /**
   * - `size=medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "typeMultilineSizeMedium": {
    "enabled": {
      "root": {
        "minHeight": "90px",
        "paddingY": "11px"
      }
    }
  }
}