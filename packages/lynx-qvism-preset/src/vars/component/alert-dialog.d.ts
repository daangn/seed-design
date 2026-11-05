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
      /** content는 가로 기준으로 안전 영역의 가운데에 놓입니다. 세로 기준으로는 상단과 하단 inset 중 큰 값을 위아래에 똑같이 두어 화면 가운데에 놓이고, 높이는 그 사이 높이를 넘지 않습니다. */
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "cornerRadius": "var(--seed-radius-r5)",
        /** content와 좌우 안전 영역 경계 사이의 최소 간격입니다. 화면 끝이 아니라 안전 영역 경계부터 잽니다. */
        "marginX": "var(--seed-dimension-x8)",
        "marginY": "var(--seed-dimension-x16)",
        "maxWidth": "272px",
        "enterDuration": "var(--seed-duration-d4)",
        "enterTimingFunction": "var(--seed-timing-function-enter-expressive)",
        "enterOpacity": "0",
        "enterScale": "1.3",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitOpacity": "0"
      },
      "header": {
        "gap": "var(--seed-dimension-x1_5)",
        "paddingX": "var(--seed-dimension-x5)",
        "paddingTop": "var(--seed-dimension-x5)"
      },
      "footer": {
        "gap": "var(--seed-dimension-x2)",
        "paddingX": "var(--seed-dimension-x5)",
        "paddingTop": "var(--seed-dimension-x4)",
        "paddingBottom": "var(--seed-dimension-x5)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)",
        "fontSize": "var(--seed-font-size-t7)",
        "lineHeight": "var(--seed-line-height-t7)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      }
    }
  }
}