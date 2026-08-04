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
        /** 인디케이터 배경색입니다. */
        "color": "var(--seed-color-palette-static-black-alpha-800)",
        "cornerRadius": "var(--seed-radius-full)",
        "paddingX": "var(--seed-dimension-x1_5)",
        "paddingY": "var(--seed-dimension-x0_5)"
      },
      "label": {
        /** 인디케이터 배경색입니다. */
        "color": "var(--seed-color-palette-static-white)",
        "fontSize": "var(--seed-font-size-t1)",
        "lineHeight": "var(--seed-line-height-t1)",
        "fontWeight": "var(--seed-font-weight-medium)"
      }
    }
  }
}