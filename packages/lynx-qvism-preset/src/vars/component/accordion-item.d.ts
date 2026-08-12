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
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "trigger": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "rotateDuration": "var(--seed-duration-d6)",
        "rotateTimingFunction": "var(--seed-timing-function-easing)"
      },
      "content": {
        "expandHeightDuration": "var(--seed-duration-d6)",
        "expandHeightTimingFunction": "var(--seed-timing-function-easing)",
        "collapseHeightDuration": "var(--seed-duration-d6)",
        "collapseHeightTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "disabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "title": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "description": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "pressed": {
      "trigger": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        "marginX": "var(--seed-dimension-x1_5)",
        "cornerRadius": "var(--seed-dimension-x2_5)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "trigger": {
        "paddingY": "var(--seed-dimension-x4)"
      },
      "prefix": {
        "paddingRight": "var(--seed-dimension-x3)"
      },
      "prefixIcon": {
        "size": "22px"
      },
      "title": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)",
        "paddingLeft": "var(--seed-dimension-x3)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "trigger": {
        "paddingY": "var(--seed-dimension-x5)"
      },
      "prefix": {
        "paddingRight": "var(--seed-dimension-x3)"
      },
      "prefixIcon": {
        "size": "22px"
      },
      "title": {
        "fontSize": "var(--seed-font-size-t7)",
        "lineHeight": "var(--seed-line-height-t7)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x6)",
        "paddingLeft": "var(--seed-dimension-x3)"
      }
    }
  },
  /**
   * Accordion Item들이 하나의 연속된 목록처럼 표현됩니다. 밀접하게 관련된 항목들을 컴팩트하게 나열할 때 사용합니다.
   */
  "variantInline": {
    "enabled": {
      "root": {
        "dividerColor": "var(--seed-color-stroke-neutral-subtle)",
        "dividerPaddingX": "var(--seed-dimension-x3)"
      }
    }
  },
  /**
   * 각 Accordion Item이 개별 카드 형태로 분리되어 표현됩니다. 항목 간 시각적 독립성이 필요하거나, 각 섹션의 중요도가 동등할 때 사용합니다.
   */
  "variantSeparated": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px",
        "cornerRadius": "var(--seed-radius-r3)"
      }
    }
  }
}