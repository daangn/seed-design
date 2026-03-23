export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)",
        "cornerRadius": "var(--seed-radius-full)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "paddingLeft": "var(--seed-dimension-x1_5)"
      },
      "prefixAvatar": {
        "size": "var(--seed-dimension-x6)"
      },
      "suffixIcon": {
        "paddingRight": "var(--seed-dimension-x1_5)"
      },
      "label": {
        "fontWeight": "var(--seed-font-weight-medium)",
        "paddingX": "var(--seed-dimension-x1_5)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    }
  },
  /**
   * 기본 스타일입니다.
   */
  "variantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-alpha)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-alpha-pressed)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.5"
      }
    },
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "selectedDisabled": {
      "root": {
        "opacity": "0.5"
      }
    }
  },
  /**
   * 명확한 구분이 필요한 경우 사용합니다.
   */
  "variantOutlineStrong": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.5"
      }
    },
    "selected": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-inverted-pressed)"
      }
    },
    "selectedDisabled": {
      "root": {
        "opacity": "0.5"
      }
    }
  },
  /**
   * Selection 사용 시 주목도가 낮은 스타일로 권장됩니다.
   */
  "variantOutlineWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-transparent)",
        "strokeColor": "var(--seed-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--seed-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--seed-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.5"
      }
    },
    "selected": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-contrast)",
        "color": "var(--seed-color-bg-neutral-weak)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak-pressed)"
      }
    },
    "selectedDisabled": {
      "root": {
        "opacity": "0.5"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "height": "32px",
        "paddingX": "var(--seed-dimension-x1_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "prefixAvatar": {
        "size": "var(--seed-dimension-x5)"
      },
      "icon": {
        "size": "var(--seed-dimension-x3_5)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "36px",
        "paddingX": "var(--seed-dimension-x2)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x3_5)"
      },
      "prefixAvatar": {
        "size": "var(--seed-dimension-x6)"
      },
      "icon": {
        "size": "var(--seed-dimension-x4)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "height": "40px",
        "paddingX": "var(--seed-dimension-x2_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "size": "var(--seed-dimension-x4)",
        "paddingLeft": "var(--seed-dimension-x1_5)"
      },
      "suffixIcon": {
        "size": "var(--seed-dimension-x4)"
      },
      "prefixAvatar": {
        "size": "var(--seed-dimension-x7)"
      },
      "icon": {
        "size": "var(--seed-dimension-x4)"
      }
    }
  },
  "layoutWithText": {},
  "sizeSmallLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x8)"
      }
    }
  },
  "sizeMediumLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x9)"
      }
    }
  },
  "sizeLargeLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--seed-dimension-x10)"
      }
    }
  }
}