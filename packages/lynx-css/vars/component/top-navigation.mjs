export const vars = {
  "base": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-x1_5)"
      }
    }
  },
  "themeIos": {
    "enabled": {
      "root": {
        "height": "44px",
        "titleMinGap": "var(--seed-dimension-x2)"
      }
    }
  },
  "themeAndroid": {
    "enabled": {
      "root": {
        "height": "56px"
      },
      "main": {
        "paddingLeft": "var(--seed-dimension-x1_5)"
      }
    }
  },
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