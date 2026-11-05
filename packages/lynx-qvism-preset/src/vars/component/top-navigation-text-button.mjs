export const vars = {
  "base": {
    "enabled": {
      "root": {
        "height": "44px",
        "paddingX": "var(--seed-dimension-x2_5)",
        "cornerRadius": "var(--seed-radius-r2)",
        "color": "var(--seed-color-bg-transparent)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-medium)",
        "maxFontSizeScale": "1.2",
        "minFontSizeScale": "1",
        "maxLineHeightScale": "1.2",
        "minLineHeightScale": "1"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    }
  },
  "toneLayer": {
    "enabled": {
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "disabled": {
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "toneTransparent": {
    "enabled": {
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      }
    },
    "disabled": {
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "themeIos": {
    "enabled": {
      "root": {
        "maxWidth": "96px"
      }
    }
  },
  "themeAndroid": {}
}