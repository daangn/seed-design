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
      /** content는 가로 기준으로 안전 영역의 가운데에 놓이고, 소비자가 지정한 너비는 안전 영역의 너비를 기준으로 합니다. 세로 기준으로는 상단과 하단 inset 중 큰 값을 위아래에 똑같이 두어 화면 가운데에 놓입니다. */
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "cornerRadius": "var(--seed-radius-r5)",
        /** 좌우 inset을 뺀 viewport width 또는 parent width에 대한 비율입니다. viewport `md` 미만에서 적용합니다. */
        "widthFraction": "0.9",
        /** viewport height 또는 parent height에 대한 최대 비율입니다. 최대 높이는 min(maxHeightFraction × 높이, 상단과 하단 inset 중 큰 값을 위아래에서 각각 뺀 높이)입니다. */
        "maxHeightFraction": "0.8",
        /** viewport `md` 이상에서 content와 좌우 안전 영역 경계 사이에 두는 최소 간격입니다. */
        "marginX": "var(--seed-dimension-x5)",
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
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x6)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. 본문이 오버플로되어 스크롤 가능한 경우에만 적용됩니다. */
        "paddingBottom": "var(--seed-dimension-x4)",
        /** closeButton이 표시되는 경우 paddingRight에 추가되는 여백입니다. */
        "closeButtonGap": "var(--seed-dimension-x1_5)"
      },
      "body": {
        "paddingX": "var(--seed-dimension-x6)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. 본문이 오버플로되어 스크롤 가능한 경우에만 적용됩니다. */
        "paddingBottom": "var(--seed-dimension-x12)",
        "strokeDuration": "var(--seed-duration-color-transition)",
        "strokeTimingFunction": "var(--seed-timing-function-easing)"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-x6)",
        "paddingTop": "var(--seed-dimension-x4)",
        /** body의 하단 padding이며, 동시에 하단 scroll fog 그라데이션의 높이로도 사용됩니다. 본문이 오버플로되어 스크롤 가능한 경우에만 적용됩니다. */
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
        "fromTop": "var(--seed-dimension-x7)",
        "fromRight": "var(--seed-dimension-x6)"
      }
    },
    "scrolled": {
      "body": {
        /** 본문이 스크롤된(scrolled) 상태에서 body 상단에 나타나는 divider의 색상입니다. */
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        /** 본문이 스크롤된(scrolled) 상태에서 body 상단에 나타나는 divider의 두께입니다. */
        "strokeWidth": "1px"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      /** content는 가로 기준으로 안전 영역의 가운데에 놓이고, 소비자가 지정한 너비는 안전 영역의 너비를 기준으로 합니다. 세로 기준으로는 상단과 하단 inset 중 큰 값을 위아래에 똑같이 두어 화면 가운데에 놓입니다. */
      "content": {
        "maxWidth": "480px"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      /** content는 가로 기준으로 안전 영역의 가운데에 놓이고, 소비자가 지정한 너비는 안전 영역의 너비를 기준으로 합니다. 세로 기준으로는 상단과 하단 inset 중 큰 값을 위아래에 똑같이 두어 화면 가운데에 놓입니다. */
      "content": {
        "maxWidth": "800px"
      }
    }
  }
}