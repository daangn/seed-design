export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-weak)",
        "strokeColorDuration": "var(--seed-duration-color-transition)",
        "strokeColorTimingFunction": "var(--seed-timing-function-easing)",
        "strokeWidthDuration": "var(--seed-duration-d3)",
        "strokeWidthTimingFunction": "var(--seed-timing-function-easing)"
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
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "suffixText": {
        "color": "var(--seed-color-fg-neutral-muted)",
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
      }
    }
  },
  /**
   * - `variant=outline`: 기본 스타일입니다.
   */
  "variantOutline": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-r3)",
        "paddingX": "var(--seed-dimension-x4)",
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
   */
  "variantOutlineSizeLarge": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)",
        "minHeight": "var(--seed-dimension-x13)"
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
   */
  "variantOutlineSizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x1_5)",
        "minHeight": "var(--seed-dimension-x10)"
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
   * - `variant=underline`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
   */
  "variantUnderline": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x2_5)",
        "minHeight": "var(--seed-dimension-x10)",
        "strokeBottomWidth": "1px"
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
  "typeMultilineSizeLarge": {
    "enabled": {
      "root": {
        "minHeight": "95px",
        "paddingY": "var(--seed-dimension-x3_5)"
      }
    }
  },
  "typeMultilineSizeMedium": {
    "enabled": {
      "root": {
        "minHeight": "90px",
        "paddingY": "11px"
      }
    }
  }
}