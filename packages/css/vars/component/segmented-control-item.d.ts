export declare const vars: {
  "base": {
    "enabled": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 Segmented Control Indicator는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
      "root": {
        "minWidth": "86px",
        "minHeight": "34px",
        "paddingX": "var(--seed-dimension-x6)",
        "paddingY": "var(--seed-dimension-x1_5)",
        "cornerRadius": "var(--seed-radius-full)",
        "gap": "var(--seed-dimension-x1_5)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-bold)",
        "color": "var(--seed-color-fg-neutral-subtle)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "pressed": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. root의 배경색과 Segmented Control Indicator는 그대로 있고, 그 위에 요소들이 위치하는 콘텐츠 레이어만 한 덩어리로 축소됩니다. */
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)",
        "strokeWidth": "1px",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      }
    },
    "selected": {
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "disabled": {
      "label": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}