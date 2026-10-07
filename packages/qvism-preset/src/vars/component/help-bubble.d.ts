export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)",
        "cornerRadius": "var(--seed-radius-r3)",
        "paddingX": "var(--seed-dimension-x3)",
        "paddingY": "var(--seed-dimension-x2_5)",
        "gap": "var(--seed-dimension-x1)",
        /** 가용 너비(overflowPadding 참고)가 이보다 작으면 가용 너비로 축소됩니다. */
        "maxWidth": "280px",
        "enterScale": "0.9",
        "enterOpacity": "0",
        "enterDuration": "var(--seed-duration-d4)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "exitScale": "1",
        "exitOpacity": "0",
        "exitDuration": "var(--seed-duration-d4)",
        "exitTimingFunction": "var(--seed-timing-function-easing)",
        /** 말풍선과 안전 영역 경계 사이의 최소 간격을 정의합니다. 말풍선은 화면 끝에서 inset + overflowPadding만큼 안쪽에 배치되며, 가용 너비도 같은 기준으로 계산합니다. */
        "overflowPadding": "var(--seed-dimension-x4)"
      },
      "arrow": {
        "color": "var(--seed-color-bg-neutral-inverted)",
        "width": "12px",
        "height": "8px",
        "cornerRadius": "2px",
        /** arrow와 타겟 요소 사이의 거리를 정의합니다. */
        "gutter": "4px",
        /** arrow와 root의 경계 사이의 최소 간격을 정의합니다. */
        "padding": "14px"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral-inverted)",
        "fontSize": "var(--seed-font-size-t3)",
        "fontWeight": "var(--seed-font-weight-bold)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-inverted)",
        "fontSize": "var(--seed-font-size-t3)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "closeButton": {
        "color": "var(--seed-color-fg-neutral-inverted)",
        "size": "var(--seed-dimension-x3_5)",
        "targetSize": "38px",
        "marginTop": "var(--seed-dimension-x0_5)"
      }
    }
  }
}