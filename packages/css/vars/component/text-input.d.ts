export declare const vars: {
  "base": {
    "rest": {
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
    "focusedInvalid": {
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
    "rest": {
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
   * - `type=singleline`: 한 줄 입력입니다.
   */
  "variantOutlineSizeLargeTypeSingleline": {
    "rest": {
      "root": {
        "minHeight": "var(--seed-dimension-x13)"
      }
    }
  },
  /**
   * - `variant=outline`: 기본 스타일입니다.
   * - `size=large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "variantOutlineSizeLarge": {
    "rest": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)",
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
   * - `type=singleline`: 한 줄 입력입니다.
   */
  "variantOutlineSizeMediumTypeSingleline": {
    "rest": {
      "root": {
        "minHeight": "var(--seed-dimension-x10)"
      }
    }
  },
  /**
   * - `variant=outline`: 기본 스타일입니다.
   * - `size=medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "variantOutlineSizeMedium": {
    "rest": {
      "root": {
        "gap": "var(--seed-dimension-x2)",
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
    "rest": {
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
   * - `type=singleline`: 한 줄 입력입니다.
   */
  "variantUnderlineSizeLargeTypeSingleline": {
    "rest": {
      "root": {
        "minHeight": "var(--seed-dimension-x10)",
        "paddingY": "var(--seed-dimension-x2)"
      }
    }
  },
  /**
   * - `variant=underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
   * - `size=large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "variantUnderlineSizeLarge": {
    "rest": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)"
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
   * - `type=singleline`: 한 줄 입력입니다.
   */
  "variantUnderlineSizeMediumTypeSingleline": {
    "rest": {
      "root": {
        "minHeight": "34px",
        "paddingY": "var(--seed-dimension-x1_5)"
      }
    }
  },
  /**
   * - `variant=underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
   * - `size=medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "variantUnderlineSizeMedium": {
    "rest": {
      "root": {
        "gap": "var(--seed-dimension-x2)"
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
   * - `size=large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
   * - `type=multiline`: 여러 줄 입력입니다. 같은 size의 singleline보다 높이가 큽니다.
   */
  "sizeLargeTypeMultiline": {
    "rest": {
      "root": {
        "minHeight": "94px",
        "paddingY": "var(--seed-dimension-x3_5)"
      }
    }
  },
  /**
   * - `size=medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   * - `type=multiline`: 여러 줄 입력입니다. 같은 size의 singleline보다 높이가 큽니다.
   */
  "sizeMediumTypeMultiline": {
    "rest": {
      "root": {
        "minHeight": "82px",
        "paddingY": "var(--seed-dimension-x3)"
      }
    }
  }
}