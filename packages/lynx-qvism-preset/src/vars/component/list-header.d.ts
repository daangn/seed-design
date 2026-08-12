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
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingY": "var(--seed-dimension-x2)",
        "gap": "var(--seed-dimension-x2_5)",
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      }
    }
  },
  "variantMediumWeak": {
    "enabled": {
      "root": {
        "fontWeight": "var(--seed-font-weight-medium)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      }
    }
  },
  "variantBoldSolid": {
    "enabled": {
      "root": {
        "fontWeight": "var(--seed-font-weight-bold)",
        "color": "var(--seed-color-fg-neutral)"
      }
    }
  }
}