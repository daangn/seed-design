export declare const vars: {
  "base": {
    "rest": {
      "root": {
        "paddingY": "var(--seed-dimension-x3)",
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "color": "var(--seed-color-bg-transparent)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "marginDuration": "var(--seed-duration-d3)",
        "marginTimingFunction": "var(--seed-timing-function-easing)",
        "borderRadiusDuration": "var(--seed-duration-d3)",
        "borderRadiusTimingFunction": "var(--seed-timing-function-easing)",
        "contentScaleDuration": "var(--seed-duration-pressed-scale)",
        "contentScaleTimingFunction": "var(--seed-timing-function-pressed-scale)"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)",
        "paddingRight": "var(--seed-dimension-x2_5)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "detail": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "prefix": {
        "paddingRight": "var(--seed-dimension-x3)"
      },
      "prefixIcon": {
        "size": "22px",
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffix": {
        "gap": "var(--seed-dimension-x1)"
      },
      "suffixText": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)"
      },
      "suffixIcon": {
        "size": "18px",
        "color": "var(--seed-color-fg-neutral-subtle)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        /** pressed 시 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 배경 레이어 위 요소들이 위치하는 레이아웃 레이어는 scale로 인해 전체적으로 줄어드는 형태로 두 레이어가 별개로 작동합니다. 이 값은 OS 동작 줄이기 설정의 영향을 받지 않습니다. */
        "marginX": "var(--seed-dimension-x1_5)",
        "cornerRadius": "var(--seed-dimension-x2_5)",
        /** pressed 시 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 배경 레이어 위 요소들이 위치하는 레이아웃 레이어는 scale로 인해 전체적으로 줄어드는 형태로 두 레이어가 별개로 작동합니다. */
        "contentScale": "var(--seed-scale-s97)"
      }
    },
    "highlighted": {
      "root": {
        "color": "var(--seed-color-bg-brand-weak)"
      }
    },
    "pressedHighlighted": {
      "root": {
        "color": "var(--seed-color-bg-brand-weak-pressed)"
      }
    },
    "disabled": {
      "title": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "detail": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "prefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}