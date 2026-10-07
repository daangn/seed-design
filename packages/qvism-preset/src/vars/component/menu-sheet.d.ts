export declare const vars: {
  "base": {
    "enabled": {
      "backdrop": {
        "color": "var(--seed-color-bg-overlay)",
        "enterDuration": "var(--seed-duration-d2)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      /** content는 가로 기준으로 안전 영역의 가운데에 놓입니다. */
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "maxWidth": "480px",
        /** inset을 빼지 않은 viewport height 또는 parent height에 대한 최대 비율입니다. 최대 높이는 min(maxHeightFraction × 높이, 상단 inset을 뺀 높이)이므로, content는 상단 안전 영역 경계까지만 커집니다. */
        "maxHeightFraction": "0.9",
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "paddingTop": "var(--seed-dimension-x6)",
        /** 이 값은 하단 inset과 합산하여 적용합니다. */
        "paddingBottom": "var(--seed-dimension-x4)",
        "topCornerRadius": "var(--seed-radius-r5)",
        "enterDuration": "var(--seed-duration-d6)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-exit)"
      },
      "header": {
        "gap": "var(--seed-dimension-x1)",
        /** 이 값은 하단 inset과 합산하여 적용합니다. */
        "paddingBottom": "var(--seed-dimension-x4)"
      },
      "title": {
        "fontSize": "var(--seed-font-size-t6)",
        "lineHeight": "var(--seed-line-height-t6)",
        "fontWeight": "var(--seed-font-weight-bold)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "list": {
        "gap": "var(--seed-dimension-x2_5)"
      },
      "group": {
        "cornerRadius": "var(--seed-radius-r4)"
      },
      "divider": {
        "strokeBottomWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "footer": {
        "paddingTop": "var(--seed-dimension-x2_5)"
      }
    }
  }
}