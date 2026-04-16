export declare const vars: {
  "base": {
    "enabled": {
      "item": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      },
      "trigger": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)"
      },
      "prefix": {
        "color": "var(--seed-color-fg-neutral-subtle)"
      },
      "body": {
        "gap": "var(--seed-dimension-x0_5)"
      },
      "title": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-medium)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-medium)",
        "gap": "var(--seed-dimension-x0_5)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "rotateDuration": "var(--seed-duration-d6)",
        "rotateTimingFunction": "var(--seed-timing-function-easing)"
      },
      "contentInner": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "color": "var(--seed-color-fg-neutral-muted)"
      },
      "content": {
        "paddingX": "var(--seed-dimension-spacing-x-global-gutter)",
        "expandHeightDuration": "var(--seed-duration-d6)",
        "expandHeightTimingFunction": "var(--seed-timing-function-easing)",
        "collapseHeightDuration": "var(--seed-duration-d6)",
        "collapseHeightTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "disabled": {
      "prefix": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "title": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "description": {
        "color": "var(--seed-color-fg-disabled)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "pressed": {
      "trigger": {
        "color": "var(--seed-color-bg-transparent-pressed)",
        "marginX": "var(--seed-dimension-x1_5)",
        "cornerRadius": "var(--seed-dimension-x2_5)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "trigger": {
        "paddingY": "var(--seed-dimension-x4)"
      },
      "prefix": {
        "paddingRight": "var(--seed-dimension-x3)"
      },
      "title": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t3)",
        "lineHeight": "var(--seed-line-height-t3)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x5)",
        "paddingLeft": "var(--seed-dimension-x3)"
      },
      "content": {
        "paddingTop": "var(--seed-dimension-x0_5)",
        "paddingBottom": "var(--seed-dimension-x4)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "trigger": {
        "paddingY": "var(--seed-dimension-x5)"
      },
      "prefix": {
        "paddingRight": "var(--seed-dimension-x3)"
      },
      "title": {
        "fontSize": "var(--seed-font-size-t7)",
        "lineHeight": "var(--seed-line-height-t7)"
      },
      "description": {
        "fontSize": "var(--seed-font-size-t5)",
        "lineHeight": "var(--seed-line-height-t5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x6)",
        "paddingLeft": "var(--seed-dimension-x3)"
      },
      "content": {
        "paddingTop": "var(--seed-dimension-x1)",
        "paddingBottom": "var(--seed-dimension-x5)"
      }
    }
  },
  /**
   * Full-width items with dividers
   */
  "variantInline": {
    "enabled": {
      "item": {
        "dividerColor": "var(--seed-color-stroke-neutral-subtle)",
        "dividerPaddingX": "var(--seed-dimension-x3)"
      }
    }
  },
  /**
   * Card-style independent items with gap
   */
  "variantSeparated": {
    "enabled": {
      "item": {
        "borderColor": "var(--seed-color-stroke-neutral-muted)",
        "cornerRadius": "var(--seed-radius-r3)"
      }
    }
  },
  /**
   * - `variant=separated`: Card-style independent items with gap
   */
  "variantSeparatedSizeMedium": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x3)"
      }
    }
  },
  /**
   * - `variant=separated`: Card-style independent items with gap
   */
  "variantSeparatedSizeLarge": {
    "enabled": {
      "root": {
        "gap": "var(--seed-dimension-x4)"
      }
    }
  }
}