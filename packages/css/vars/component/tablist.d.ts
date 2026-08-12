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
        "color": "var(--seed-color-bg-layer-default)",
        "strokeBottomWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "indicator": {
        "height": "2px",
        "color": "var(--seed-color-fg-neutral)",
        "transformDuration": "var(--seed-duration-d4)",
        "transformTimingFunction": "var(--seed-timing-function-easing)"
      }
    }
  },
  "layoutHug": {
    "enabled": {
      "root": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)"
      },
      "indicator": {
        "insetX": "0px"
      }
    }
  },
  "layoutFill": {
    "enabled": {
      "root": {
        "paddingX": "0px"
      },
      "indicator": {
        "insetX": "var(--seed-dimension-spacing-x-global-gutter)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "height": "40px"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "44px"
      }
    }
  }
}