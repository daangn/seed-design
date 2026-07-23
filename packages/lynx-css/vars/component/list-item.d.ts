export declare const vars: {
  "base": {
    "enabled": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 그 위에 요소들이 위치하는 콘텐츠 레이어는 전체가 축소됩니다. */
      "root": {
        "paddingY": "var(--seed-dimension-x3)",
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "color": "var(--seed-color-bg-transparent)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "marginDuration": "var(--seed-duration-d3)",
        "marginTimingFunction": "var(--seed-timing-function-easing)",
        "borderRadiusDuration": "var(--seed-duration-d3)",
        "borderRadiusTimingFunction": "var(--seed-timing-function-easing)"
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
      /** 여기에 중첩되는 Checkmark, Radiomark, Switchmark는 pressed 시 자체적으로 축소되지 않습니다. 행 전체의 배경과 콘텐츠 레이어 축소만으로 충분한 피드백이 되기 때문입니다. */
      "prefix": {
        "paddingRight": "var(--seed-dimension-x3)"
      },
      "prefixIcon": {
        "size": "22px",
        "color": "var(--seed-color-fg-neutral)"
      },
      /** 여기에 중첩되는 Checkmark, Radiomark, Switchmark는 pressed 시 자체적으로 축소되지 않습니다. 행 전체의 배경과 콘텐츠 레이어 축소만으로 충분한 피드백이 되기 때문입니다. */
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
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 그 위에 요소들이 위치하는 콘텐츠 레이어는 전체가 축소됩니다. */
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        /** 배경 레이어가 좁아지는 폭입니다. */
        "marginX": "var(--seed-dimension-x1_5)",
        "cornerRadius": "var(--seed-dimension-x2_5)"
      }
    },
    "highlighted": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 그 위에 요소들이 위치하는 콘텐츠 레이어는 전체가 축소됩니다. */
      "root": {
        "color": "var(--seed-color-bg-brand-weak)"
      }
    },
    "highlightedPressed": {
      /** pressed 시 배경 레이어와 콘텐츠 레이어가 별개로 동작합니다. 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 그 위에 요소들이 위치하는 콘텐츠 레이어는 전체가 축소됩니다. */
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