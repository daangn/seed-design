export declare const vars: {
  "base": {
    "enabled": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색은 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색은 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
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
  "labelAlignLeft": {
    "enabled": {}
  },
  /**
   * 라벨을 중앙 정렬합니다.
   */
  "labelAlignCenter": {
    "enabled": {}
  }
}