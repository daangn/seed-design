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
      "root": {
        "color": "var(--seed-color-bg-brand-solid)",
        "cornerRadius": "var(--seed-radius-full)",
        "shadow": "var(--seed-shadow-s3)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "layoutDuration": "var(--seed-duration-d4)",
        "layoutTimingFunction": "var(--seed-timing-function-easing)"
      },
      "icon": {
        "color": "var(--seed-color-palette-static-white)",
        "sizeDuration": "var(--seed-duration-d4)",
        "sizeTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid-pressed)"
      }
    }
  },
  /**
   * 라벨이 포함된 확장 형태로, 버튼의 역할을 명확히 전달합니다.
   */
  "extendedTrue": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x1)",
        "paddingX": "var(--seed-dimension-x4_5)",
        "paddingY": "var(--seed-dimension-x3)",
        "minHeight": "48px"
      },
      "icon": {
        "size": "var(--seed-dimension-x4)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-bold)"
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
        "size": "var(--seed-dimension-x6)"
      }
    }
  }
}