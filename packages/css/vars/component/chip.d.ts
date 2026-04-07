export declare const vars: {
  "base": {
    "enabled": {
      "root": {
        "colorDuration": "var(--ride-duration-color-transition)",
        "colorTimingFunction": "var(--ride-timing-function-easing)",
        "cornerRadius": "var(--ride-radius-full)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "paddingLeft": "var(--ride-dimension-x1_5)"
      },
      "prefixAvatar": {
        "size": "var(--ride-dimension-x6)"
      },
      "suffixIcon": {
        "paddingRight": "var(--ride-dimension-x1_5)"
      },
      "label": {
        "fontWeight": "var(--ride-font-weight-medium)",
        "paddingX": "var(--ride-dimension-x1_5)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    }
  },
  /**
   * 기본 스타일입니다.
   */
  "variantSolid": {
    "enabled": {
      "root": {
        "color": "var(--ride-color-bg-neutral-weak-alpha)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-weak-alpha-pressed)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.5"
      }
    },
    "selected": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "suffixIcon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
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
        "color": "var(--ride-color-bg-transparent)",
        "strokeColor": "var(--ride-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.5"
      }
    },
    "selected": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted)"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "suffixIcon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral-inverted)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-inverted-pressed)"
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
        "color": "var(--ride-color-bg-transparent)",
        "strokeColor": "var(--ride-color-stroke-neutral-muted)",
        "strokeWidth": "1px"
      },
      "label": {
        "color": "var(--ride-color-fg-neutral)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "suffixIcon": {
        "color": "var(--ride-color-fg-neutral)"
      },
      "icon": {
        "color": "var(--ride-color-fg-neutral)"
      }
    },
    "pressed": {
      "root": {
        "color": "var(--ride-color-bg-transparent-pressed)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.5"
      }
    },
    "selected": {
      "root": {
        "strokeColor": "var(--ride-color-stroke-neutral-contrast)",
        "color": "var(--ride-color-bg-neutral-weak)"
      }
    },
    "selectedPressed": {
      "root": {
        "color": "var(--ride-color-bg-neutral-weak-pressed)"
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
        "paddingX": "var(--ride-dimension-x1_5)"
      },
      "label": {
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "size": "var(--ride-dimension-x3_5)"
      },
      "suffixIcon": {
        "size": "var(--ride-dimension-x3_5)"
      },
      "prefixAvatar": {
        "size": "var(--ride-dimension-x5)"
      },
      "icon": {
        "size": "var(--ride-dimension-x3_5)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "36px",
        "paddingX": "var(--ride-dimension-x2)"
      },
      "label": {
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "size": "var(--ride-dimension-x4)"
      },
      "suffixIcon": {
        "size": "var(--ride-dimension-x3_5)"
      },
      "prefixAvatar": {
        "size": "var(--ride-dimension-x6)"
      },
      "icon": {
        "size": "var(--ride-dimension-x4)"
      }
    }
  },
  "sizeLarge": {
    "enabled": {
      "root": {
        "height": "40px",
        "paddingX": "var(--ride-dimension-x2_5)"
      },
      "label": {
        "fontSize": "var(--ride-font-size-t4)",
        "lineHeight": "var(--ride-line-height-t4)"
      },
      /** Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다. */
      "prefixIcon": {
        "size": "var(--ride-dimension-x4)",
        "paddingLeft": "var(--ride-dimension-x1_5)"
      },
      "suffixIcon": {
        "size": "var(--ride-dimension-x4)"
      },
      "prefixAvatar": {
        "size": "var(--ride-dimension-x7)"
      },
      "icon": {
        "size": "var(--ride-dimension-x4)"
      }
    }
  },
  "layoutWithText": {},
  "sizeSmallLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--ride-dimension-x8)"
      }
    }
  },
  "sizeMediumLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--ride-dimension-x9)"
      }
    }
  },
  "sizeLargeLayoutIconOnly": {
    "enabled": {
      "root": {
        "minWidth": "var(--ride-dimension-x10)"
      }
    }
  }
}