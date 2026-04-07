export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "color": "var(--ride-color-bg-brand-solid)",
        "cornerRadius": "var(--ride-radius-full)",
        "shadow": "var(--ride-shadow-s3)",
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)",
        "layoutDuration": "var(--ride-duration-d4)",
        "layoutTimingFunction": "var(--ride-timing-function-easing)"
      },
      "icon": {
        "color": "var(--ride-color-palette-static-white)",
        "sizeDuration": "var(--ride-duration-d4)",
        "sizeTimingFunction": "var(--ride-timing-function-easing)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-brand-solid-pressed)"
      }
    }
  },
  /**
   * 라벨이 포함된 확장 형태로, 버튼의 역할을 명확히 전달합니다.
   */
  "extendedTrue": {
    "enabled": {
      "root": {
        "gap": "var(--ride-dimension-x1)",
        "paddingX": "var(--ride-dimension-x4_5)",
        "paddingY": "var(--ride-dimension-x3)",
        "minHeight": "48px"
      },
      "icon": {
        "size": "var(--ride-dimension-x5)"
      },
      "label": {
        "color": "var(--ride-color-palette-static-white)",
        "fontSize": "var(--ride-font-size-t5)",
        "lineHeight": "var(--ride-line-height-t5)",
        "fontWeight": "var(--ride-font-weight-bold)"
      }
    }
  },
  /**
   * 아이콘만 표시되는 기본 형태입니다.
   */
  "extendedFalse": {
    "enabled": {
      "root": {
        "size": "56px"
      },
      "icon": {
        "size": "var(--ride-dimension-x6)"
      }
    }
  }
}