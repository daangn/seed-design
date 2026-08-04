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
      "content": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-medium)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    }
  },
  /**
   * 일반적인 작업을 수행하는 기본 아이템입니다.
   */
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
  /**
   * 데이터 삭제와 같이 되돌릴 수 없는 작업을 수행하는 아이템입니다.
   */
  "toneCritical": {
    "enabled": {
      "prefixIcon": {
        "color": "var(--seed-color-fg-critical)"
      },
      "label": {
        "color": "var(--seed-color-fg-critical)"
      }
    }
  },
  /**
   * 라벨을 왼쪽 정렬합니다.
   */
  "labelAlignLeft": {},
  /**
   * 라벨을 중앙 정렬합니다.
   */
  "labelAlignCenter": {}
}