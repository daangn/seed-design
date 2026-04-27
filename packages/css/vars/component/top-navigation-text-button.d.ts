export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        /** 버튼 레이블이 길어졌을 때 ellipsis 말줄임을 시작할 최대 너비입니다. Top Navigation main slot이 충분한 공간을 차지할 수 있도록 하기 위해 폰트 스케일링의 영향을 받지 않는 px 값을 사용합니다. */
        "maxWidth": "96px",
        "height": "44px",
        "paddingX": "var(--seed-dimension-x2_5)"
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
  }
}