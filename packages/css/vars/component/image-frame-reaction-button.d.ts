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
      /** 하트 아이콘 토글 버튼입니다. 이미지 위에서 좋아요 기능에 사용됩니다. */
      "root": {
        /** 보이는 버튼 크기입니다. */
        "size": "var(--seed-dimension-x6)",
        /** 터치 영역 크기입니다. */
        "targetSize": "var(--seed-dimension-x10)"
      },
      /** lineIcon 아래에 내려가는 하트 아이콘입니다. */
      "fillIcon": {
        "gradient": "var(--seed-color-palette-static-black-alpha-600) 0%, var(--seed-color-palette-static-black-alpha-600) 100%",
        /** 보이는 버튼 크기입니다. */
        "size": "var(--seed-dimension-x6)",
        "shadow": "0px 2px 4px 0px #00000026"
      },
      /** fillIcon 위로 올라가는 하트 아이콘입니다. */
      "lineIcon": {
        "color": "var(--seed-color-palette-static-white)",
        /** 보이는 버튼 크기입니다. */
        "size": "var(--seed-dimension-x6)"
      }
    },
    "selected": {
      /** lineIcon 아래에 내려가는 하트 아이콘입니다. */
      "fillIcon": {
        "gradient": "#FF9A56 0%, #FF6600 100%"
      },
      /** fillIcon 위로 올라가는 하트 아이콘입니다. */
      "lineIcon": {
        "color": "var(--seed-color-bg-transparent)"
      }
    }
  }
}