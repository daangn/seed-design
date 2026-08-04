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
        "color": "var(--seed-color-bg-layer-default)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)"
      },
      "valueDisplay": {
        "fontWeight": "var(--seed-font-weight-medium)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "divider": {
        "color": "var(--seed-color-stroke-neutral-subtle)"
      }
    },
    "invalid": {
      "root": {
        "strokeWidth": "2px",
        "strokeColor": "var(--seed-color-stroke-critical-solid)"
      }
    },
    "disabled": {
      "valueDisplay": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x9)",
        "cornerRadius": "var(--seed-radius-r2)"
      },
      "valueDisplay": {
        "paddingX": "var(--seed-dimension-x2)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "divider": {
        "width": "1px",
        "height": "var(--seed-dimension-x4)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x10)",
        "cornerRadius": "var(--seed-radius-r2)"
      },
      "valueDisplay": {
        "paddingX": "var(--seed-dimension-x2)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "divider": {
        "width": "1px",
        "height": "var(--seed-dimension-x4)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x13)",
        "cornerRadius": "var(--seed-radius-r3)"
      },
      "valueDisplay": {
        "paddingX": "var(--seed-dimension-x2)",
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)"
      },
      "divider": {
        "width": "1px",
        "height": "var(--seed-dimension-x4)"
      }
    }
  }
}