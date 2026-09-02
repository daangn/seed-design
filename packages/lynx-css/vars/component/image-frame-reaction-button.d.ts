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
        "gradient": {
          "serialized": "var(--seed-color-palette-static-black-alpha-600) 0%, var(--seed-color-palette-static-black-alpha-600) 100%",
          "stops": [
            {
              "color": "var(--seed-color-palette-static-black-alpha-600)",
              "position": 0
            },
            {
              "color": "var(--seed-color-palette-static-black-alpha-600)",
              "position": 1
            }
          ]
        },
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
        "gradient": {
          "serialized": "#FF9A56 0%, #FF6600 100%",
          "stops": [
            {
              "color": "#FF9A56",
              "position": 0
            },
            {
              "color": "#FF6600",
              "position": 1
            }
          ]
        }
      },
      /** fillIcon 위로 올라가는 하트 아이콘입니다. */
      "lineIcon": {
        "color": "var(--seed-color-bg-transparent)"
      }
    }
  }
}