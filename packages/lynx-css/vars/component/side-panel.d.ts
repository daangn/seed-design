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
        "paddingTop": "var(--seed-dimension-x6)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. */
        "paddingBottom": "var(--seed-dimension-x4)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-x6)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. */
        "paddingBottom": "var(--seed-dimension-x12)",
        "transitionDuration": "var(--seed-duration-color-transition)",
        "transitionTimingFunction": "var(--seed-timing-function-easing)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x4)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. */
        "paddingBottom": "var(--seed-dimension-x6)",
        "gap": "var(--seed-dimension-x2)"
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
        /** 본문이 스크롤된(scrolled) 상태에서 body 상단에 나타나는 divider의 색상입니다. */
        "stroke": "var(--seed-color-stroke-neutral-muted)"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "content": {
        "width": "480px"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "content": {
        "width": "720px"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "content": {
        "width": "960px"
      }
    }
  }
}