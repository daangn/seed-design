export declare const vars: {
  "base": {
    "enabled": {
      "backdrop": {
        "color": "var(--seed-color-bg-overlay)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      /** content는 가로 기준으로 안전 영역의 가운데에 놓이고, 하단 inset을 content의 하단 패딩으로 적용합니다. */
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "maxWidth": "640px",
        /** inset을 빼지 않은 viewport height 또는 parent height에 대한 최대 비율입니다. 최대 높이는 min(maxHeightFraction × 높이, 상단 inset을 뺀 높이)이므로, content는 상단 안전 영역 경계까지만 커집니다. */
        "maxHeightFraction": "0.9",
        "topCornerRadius": "var(--seed-radius-r6)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-exit)"
      },
      "header": {
        "gap": "var(--seed-dimension-x2)",
        "paddingTop": "var(--seed-dimension-x6)",
        "paddingBottom": "var(--seed-dimension-x4)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingTop": "var(--seed-dimension-x3)",
        "paddingBottom": "var(--seed-dimension-x4)"
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
        "fromTop": "var(--seed-dimension-x5)",
        "fromRight": "var(--seed-dimension-x5)"
      }
    }
  },
  "headerAlignmentLeft": {
    "enabled": {
      "header": {
        "paddingLeft": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingRight": "50px"
      }
    }
  },
  "headerAlignmentCenter": {
    "enabled": {
      "header": {
        "paddingLeft": "50px",
        "paddingRight": "50px"
      }
    }
  }
}