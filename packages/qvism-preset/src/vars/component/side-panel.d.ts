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
      "backdrop": {
        "color": "var(--seed-color-bg-overlay)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d6)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      /** 하단 safe-area inset을 content의 하단 패딩으로 적용합니다. */
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        /** viewport 또는 parent width에 대한 mobile content width 비율입니다. */
        "widthFraction": "0.8",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "exitDuration": "var(--seed-duration-d6)",
        "exitTimingFunction": "var(--seed-timing-function-exit-expressive)"
      },
      "header": {
        "gap": "var(--seed-dimension-x1_5)",
        "minHeight": "70px",
        "paddingX": "var(--seed-dimension-x6)",
        /** 이 값은 상단 safe-area inset과 합산하여 적용합니다. */
        "paddingTop": "var(--seed-dimension-x6)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. */
        "paddingBottom": "var(--seed-dimension-x4)",
        /** closeButton이 표시되는 경우 paddingRight에 추가되는 여백입니다. */
        "closeButtonGap": "var(--seed-dimension-x1_5)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-x6)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. */
        "paddingBottom": "var(--seed-dimension-x12)",
        "strokeDuration": "var(--seed-duration-color-transition)",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-x6)",
        /** 이 값은 상단 safe-area inset과 합산하여 적용합니다. */
        "paddingTop": "var(--seed-dimension-x4)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. */
        "paddingBottom": "var(--seed-dimension-x6)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)",
        "fontSize": "var(--seed-font-size-t8)",
        "lineHeight": "var(--seed-line-height-t8)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "closeButton": {
        "fromTop": "28px",
        "fromRight": "24px"
      }
    },
    "scrolled": {
      "body": {
        "strokeWidth": "1px",
        /** 본문이 스크롤된(scrolled) 상태에서 body 상단에 나타나는 divider의 색상입니다. */
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      /** 하단 safe-area inset을 content의 하단 패딩으로 적용합니다. */
      "content": {
        "width": "480px"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      /** 하단 safe-area inset을 content의 하단 패딩으로 적용합니다. */
      "content": {
        "width": "720px"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      /** 하단 safe-area inset을 content의 하단 패딩으로 적용합니다. */
      "content": {
        "width": "960px"
      }
    }
  }
}