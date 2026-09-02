export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        /** 가운데 정렬된 title이 좌우 영역과 겹치지 않도록 보장하는 최소 간격입니다. */
        "titleMinGap": "var(--seed-dimension-x2)"
      }
    }
  },
  "themeIos": {
    "enabled": {
      "root": {
        "height": "44px",
        /** 좌우 영역에 놓이는 버튼의 터치 영역을 기준으로 한 여백입니다. 버튼 내부 여백과 합쳐져 아이콘과 레이블 기준의 시각적 여백이 됩니다. */
        "paddingX": "var(--seed-dimension-x1_5)"
      }
    }
  },
  "themeAndroid": {
    "enabled": {
      "root": {
        "height": "56px",
        /** 좌우 영역에 놓이는 버튼의 터치 영역을 기준으로 한 여백입니다. 버튼 내부 여백과 합쳐져 아이콘과 레이블 기준의 시각적 여백이 됩니다. */
        "paddingX": "var(--seed-dimension-x1_5)"
      },
      /** title과 subtitle을 포함하는 영역입니다. */
      "main": {
        "paddingLeft": "var(--seed-dimension-x1_5)"
      }
    }
  },
  /**
   * color를 $color.bg.layer-basement 등으로 변경하여 사용할 수 있습니다.
   */
  "toneLayer": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-layer-default)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "subtitle": {
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    }
  },
  "toneTransparent": {
    "enabled": {
      "title": {
        "color": "var(--seed-color-palette-static-white)"
      },
      "subtitle": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  },
  /**
   * - `gradient=false`: false로 사용하는 것을 권장하지 않습니다. gradient 없이 사용하면 Top Navigation의 콘텐츠 가독성을 직접 확보해야 합니다. 스크린 배경 색상이 Top Navigation에 보이기를 원하는 경우 tone=layer를 사용하세요.
   */
  "toneTransparentGradientFalse": {
    "enabled": {
      "root": {
        "color": "#00000000"
      }
    }
  },
  "toneTransparentGradientTrue": {
    "enabled": {
      "root": {
        "gradient": {
          "serialized": "#00000059 0%, #00000000 100%",
          "stops": [
            {
              "color": "#00000059",
              "position": 0
            },
            {
              "color": "#00000000",
              "position": 1
            }
          ]
        },
        /** gradient가 표시될 때 하단 아래로 gradient가 확장되는 길이입니다. */
        "bleedBottom": "var(--seed-dimension-x5)"
      }
    }
  },
  "titleLayoutTitleOnly": {
    "enabled": {
      "title": {
        "fontSize": "var(--seed-font-size-t6)",
        "fontWeight": "var(--seed-font-weight-bold)",
        "lineHeight": "var(--seed-line-height-t6)",
        "maxFontSizeScale": "1.2",
        "minFontSizeScale": "1",
        "maxLineHeightScale": "1.2",
        "minLineHeightScale": "1"
      }
    }
  },
  "titleLayoutWithSubtitle": {
    "enabled": {
      "title": {
        "fontSize": "var(--seed-font-size-t5)",
        "fontWeight": "var(--seed-font-weight-bold)",
        "lineHeight": "var(--seed-line-height-t5)",
        "maxFontSizeScale": "1.2",
        "minFontSizeScale": "1",
        "maxLineHeightScale": "1.2",
        "minLineHeightScale": "1"
      },
      "subtitle": {
        "fontSize": "var(--seed-font-size-t2)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "lineHeight": "var(--seed-line-height-t2)",
        "maxFontSizeScale": "1.2",
        "minFontSizeScale": "1",
        "maxLineHeightScale": "1.2",
        "minLineHeightScale": "1"
      }
    }
  }
}