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
      "label": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-medium)"
      }
    },
    "disabled": {
      "label": {
        "opacity": "0.58",
        "opacityDuration": "var(--seed-duration-d1)",
        "opacityTimingFunction": "var(--seed-timing-function-easing)"
      }
    }
  },
  "size32": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x8)",
        "gap": "var(--seed-dimension-x2_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      }
    }
  },
  "size24": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x6)",
        "gap": "var(--seed-dimension-x2)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  },
  "size16": {
    "enabled": {
      "root": {
        "height": "var(--seed-dimension-x6)",
        "gap": "var(--seed-dimension-x1_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      }
    }
  }
}