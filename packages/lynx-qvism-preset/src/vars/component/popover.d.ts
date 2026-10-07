export declare const vars: {
  "base": {
    "enabled": {
      "content": {
        "color": "var(--seed-color-bg-layer-floating)",
        "cornerRadius": "var(--seed-radius-r5)",
        "shadow": "var(--seed-shadow-s3)",
        /** 가용 너비(overflowPadding 참고)가 이보다 작으면 가용 너비로 축소됩니다. */
        "minWidth": "320px",
        /** 가용 너비(overflowPadding 참고)가 이보다 작으면 가용 너비로 축소됩니다. */
        "maxWidth": "480px",
        /** 가용 높이(overflowPadding 참고)가 이보다 작으면 가용 높이로 축소됩니다. */
        "maxHeight": "600px",
        /** 트리거와 popover 사이의 간격을 정의합니다. */
        "gutter": "var(--seed-dimension-x2)",
        /** popover와 안전 영역 경계 사이의 최소 간격을 정의합니다. popover는 화면 끝에서 inset + overflowPadding만큼 안쪽에 배치되며, 가용 너비와 높이도 같은 기준으로 계산합니다. */
        "overflowPadding": "var(--seed-dimension-x4)",
        "enterDuration": "var(--seed-duration-d3)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterScale": "0.95",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitScale": "0.95",
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
        "fontSize": "var(--seed-font-size-t7)",
        "lineHeight": "var(--seed-line-height-t7)",
        "fontWeight": "var(--seed-font-weight-bold)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-muted)",
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "closeButton": {
        "fromTop": "27px",
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
  }
}