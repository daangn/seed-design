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
        "color": "var(--seed-color-bg-neutral-weak)",
        "cornerRadius": "var(--seed-radius-full)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "count": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontWeight": "var(--seed-font-weight-medium)"
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
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "count": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x8)",
        "paddingY": "var(--seed-dimension-x1_5)",
        "gap": "var(--seed-dimension-x1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "count": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x9)",
        "paddingY": "var(--seed-dimension-x2)",
        "gap": "var(--seed-dimension-x1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "count": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  },
  "sizeSmallLayoutWithText": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x3)"
      }
    }
  },
  "sizeSmallLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x8)"
      },
      "icon": {
        "size": "var(--seed-dimension-x4)"
      }
    }
  },
  "sizeMediumLayoutWithText": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x3_5)"
      }
    }
  },
  "sizeMediumLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x9)"
      },
      "icon": {
        "size": "var(--seed-dimension-x4)"
      }
    }
  }
}