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
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px",
        "color": "var(--seed-color-bg-transparent)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "count": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      "prefixIcon": {
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
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-brand-weak)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--seed-color-fg-brand)"
      },
      "count": {
        "color": "var(--seed-color-fg-brand)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-brand)"
      },
      "progressCircle": {
        "trackColor": "var(--seed-color-palette-carrot-200)",
        "rangeColor": "var(--seed-color-fg-brand)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "color": "var(--seed-color-bg-disabled)",
        "strokeWidth": "0px"
      },
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "count": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
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
        "color": "var(--seed-color-bg-transparent-pressed)",
        "strokeWidth": "1px"
      }
    }
  },
  "sizeXsmall": {
    "enabled": {
      "root": {
        "minHeight": "var(--seed-dimension-x8)",
        "cornerRadius": "var(--seed-radius-full)",
        "gap": "var(--seed-dimension-x1)",
        "paddingX": "var(--seed-dimension-x3)",
        "paddingY": "var(--seed-dimension-x1_5)"
      },
      "prefixIcon": {
        "size": "18px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "count": {
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
        "paddingX": "var(--seed-dimension-x3_5)",
        "paddingY": "var(--seed-dimension-x2)"
      },
      "prefixIcon": {
        "size": "18px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "count": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "progressCircle": {
        "size": "14px",
        "thickness": "2px"
      }
    }
  }
}