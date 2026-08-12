/**
 * SEED가 컴포넌트 스타일을 만들 때 쓰는 내부 값입니다. 공개 API가 아닙니다.
 * minor·patch 업그레이드만으로도 이름이나 구조가 바뀔 수 있습니다.
 * 개별 컴포넌트의 스타일이 필요하면 `recipes/*`를, 값이 필요하면 디자인 토큰(`vars/*`)을 쓰세요.
 *
 * @internal
 */
export declare const vars: {
  /**
   * - `variant=separated`: 각 Accordion Item이 개별 카드 형태로 분리되어 표현됩니다. 항목 간 시각적 독립성이 필요하거나, 각 섹션의 중요도가 동등할 때 사용합니다.
   */
  "variantSeparatedSizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x3)"
      }
    }
  },
  /**
   * - `variant=separated`: 각 Accordion Item이 개별 카드 형태로 분리되어 표현됩니다. 항목 간 시각적 독립성이 필요하거나, 각 섹션의 중요도가 동등할 때 사용합니다.
   */
  "variantSeparatedSizeLarge": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x4)"
      }
    }
  }
}