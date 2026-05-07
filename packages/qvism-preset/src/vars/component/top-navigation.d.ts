export declare const vars: {
  "themeIos": {
    "enabled": {
      "root": {
        "height": "44px",
        "paddingX": "var(--seed-dimension-x4)"
      }
    }
  },
  "themeAndroid": {
    "enabled": {
      "root": {
        "height": "56px",
        "paddingX": "var(--seed-dimension-x4)"
      },
      /** title과 subtitle을 포함하는 영역입니다. */
      "main": {
        "paddingLeft": "16px"
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
        "gradient": "#00000059 0%, #00000000 100%",
        /** gradient가 표시될 때 하단 아래로 gradient가 확장되는 길이입니다. */
        "bleedBottom": "var(--seed-dimension-x5)"
      }
    }
  },
  "dividerTrue": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-subtle)",
        "strokeWidth": "1px"
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