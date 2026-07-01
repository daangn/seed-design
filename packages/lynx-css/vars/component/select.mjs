export const vars = {
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
        "gutter": "var(--seed-dimension-x2)",
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
      },
      "item": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "marginDuration": "var(--seed-duration-d3)",
        "marginTimingFunction": "var(--seed-timing-function-easing)",
        "borderRadiusDuration": "var(--seed-duration-d3)",
        "borderRadiusTimingFunction": "var(--seed-timing-function-easing)"
      },
      "itemPrefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "itemSuffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "itemBody": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "itemLabel": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral)"
      },
      "itemDescription": {
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "itemIndicator": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "item": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        "marginX": "var(--seed-dimension-x2)",
        "cornerRadius": "var(--seed-radius-r3)"
      }
    },
    "disabled": {
      "itemPrefixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemSuffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemLabel": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemDescription": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "itemIndicator": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  },
  "sizeLarge": {
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
      },
      "item": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x3)",
        "gap": "var(--seed-dimension-x3)"
      },
      "itemPrefixIcon": {
        "size": "22px"
      },
      "itemSuffixIcon": {
        "size": "18px"
      },
      "itemLabel": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "itemDescription": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "itemIndicator": {
        "size": "18px"
      }
    }
  },
  "sizeMedium": {
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
      },
      "item": {
        "paddingX": "var(--seed-dimension-x4)",
        "paddingY": "var(--seed-dimension-x2_5)",
        "gap": "var(--seed-dimension-x2)"
      },
      "itemPrefixIcon": {
        "size": "18px"
      },
      "itemSuffixIcon": {
        "size": "16px"
      },
      "itemLabel": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "itemDescription": {
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      },
      "itemIndicator": {
        "size": "16px"
      }
    }
  }
}