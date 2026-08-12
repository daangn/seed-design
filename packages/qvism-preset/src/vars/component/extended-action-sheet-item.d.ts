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
        "minHeight": "52px",
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x3_5)",
        "gap": "var(--seed-dimension-x3_5)"
      },
      "prefixIcon": {
        "size": "22px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    }
  },
  "toneNeutral": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      }
    }
  },
  "toneCritical": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-critical)"
      },
      "label": {
        "color": "var(--seed-color-fg-critical)"
      }
    }
  }
}