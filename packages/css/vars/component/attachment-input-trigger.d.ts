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
        "size": "80px",
        "gap": "var(--seed-dimension-x1)",
        "color": "var(--seed-color-bg-transparent)",
        "cornerRadius": "var(--seed-radius-r3)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-weak)"
      },
      "icon": {
        "size": "var(--seed-dimension-x6)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "itemCount": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      },
      "maxItemCount": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemCount": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "maxItemCount": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}