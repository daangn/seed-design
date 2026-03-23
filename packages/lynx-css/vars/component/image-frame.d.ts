export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        /** 내부에 오버레이 요소가 존재하는 경우 이미지 모서리와 오버레이 요소 사이의 간격입니다. 이 값은 기본값이며 변경할 수 있습니다. */
        "padding": "var(--seed-dimension-x1_5)"
      }
    }
  },
  /**
   * 이미지 테두리에 스트로크를 표시합니다.
   */
  "strokeTrue": {
    "enabled": {
      "root": {
        /** stroke 옵션 사용 시 적용되는 테두리 색상입니다. */
        "strokeColor": "var(--seed-color-stroke-neutral-subtle)",
        /** stroke 옵션 사용 시 적용되는 테두리 두께입니다. */
        "strokeWidth": "1px"
      }
    }
  },
  /**
   * 테두리를 표시하지 않습니다.
   */
  "strokeFalse": {},
  /**
   * 모서리를 둥글게 처리합니다.
@deprecated `rounded` 옵션은 @seed-design/react@1.3.0에서 제거될 예정입니다. `borderRadius="r2"`를 사용하세요.
Reason: 모서리 스타일은 `borderRadius` prop으로 통일합니다.

   */
  "roundedTrue": {
    "enabled": {
      "root": {
        /** 이 값은 기본값이며 변경할 수 있습니다. */
        "cornerRadius": "var(--seed-radius-r2)"
      }
    }
  },
  /**
   * 모서리를 둥글게 처리하지 않습니다.
@deprecated `rounded` 옵션은 @seed-design/react@1.3.0에서 제거될 예정입니다. `borderRadius="r2"`를 사용하세요.
Reason: 모서리 스타일은 `borderRadius` prop으로 통일합니다.

   */
  "roundedFalse": {}
}