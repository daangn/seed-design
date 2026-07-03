export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-r5)",
        "color": "var(--seed-color-bg-layer-floating)",
        "shadow": "var(--seed-shadow-s3)",
        "enterDuration": "var(--seed-duration-d3)",
        "enterTimingFunction": "var(--seed-timing-function-enter)",
        "enterScale": "0.95",
        "enterOpacity": "0",
        "exitDuration": "var(--seed-duration-d2)",
        "exitTimingFunction": "var(--seed-timing-function-exit)",
        "exitScale": "0.95",
        "exitOpacity": "0",
        "paddingY": "var(--seed-dimension-x2)",
        "gap": "var(--seed-dimension-x2)",
        /** 트리거와 메뉴 사이의 간격을 정의합니다. */
        "gutter": "var(--seed-dimension-x2)",
        /** 메뉴와 뷰포트 경계 사이의 최소 간격을 정의합니다. */
        "overflowPadding": "var(--seed-dimension-x2)",
        "maxHeight": "480px"
      },
      "groupLabel": {
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "divider": {
        "marginX": "var(--seed-dimension-x4)",
        "height": "1px",
        "color": "var(--seed-color-stroke-neutral-muted)"
      }
    }
  },
  /**
   * 뷰포트 너비와 관계없이 사용할 수 있습니다.
   */
  "sizeMedium": {
    "enabled": {
      "root": {
        "width": "240px"
      },
      "groupLabel": {
        "paddingY": "var(--seed-dimension-x2_5)",
        "paddingX": "var(--seed-dimension-x4)",
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-medium)"
      }
    }
  },
  /**
   * Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
   */
  "sizeSmall": {
    "enabled": {
      "root": {
        "width": "200px"
      },
      "groupLabel": {
        "paddingY": "var(--seed-dimension-x2)",
        "paddingX": "var(--seed-dimension-x4)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-regular)"
      }
    }
  }
}