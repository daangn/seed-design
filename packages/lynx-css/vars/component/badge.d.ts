export declare const vars: {
  "sizeLarge": {
    "enabled": {
      "root": {
        /** 10글자 이상의 텍스트를 말줄임 처리하기 위해 설정된 최대 너비입니다. */
        "maxWidth": "6.75rem",
        "minHeight": "var(--seed-dimension-x6)",
        "paddingX": "var(--seed-dimension-x2)",
        "paddingY": "var(--seed-dimension-x1)",
        "cornerRadius": "var(--seed-radius-r1_5)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t2)",
        "lineHeight": "var(--seed-line-height-t2)"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        /** 10글자 이상의 텍스트를 말줄임 처리하기 위해 설정된 최대 너비입니다. */
        "maxWidth": "7.5rem",
        "minHeight": "var(--seed-dimension-x5)",
        "paddingX": "var(--seed-dimension-x1_5)",
        "paddingY": "var(--seed-dimension-x0_5)",
        "cornerRadius": "var(--seed-radius-r1)"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t1)",
        "lineHeight": "var(--seed-line-height-t1)"
      }
    }
  },
  /**
   * 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "variantWeak": {
    "enabled": {
      "label": {
        "fontWeight": "var(--seed-font-weight-medium)"
      }
    }
  },
  /**
   * 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "variantSolid": {
    "enabled": {
      "label": {
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    }
  },
  /**
   * 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "variantOutline": {
    "enabled": {
      "root": {
        "strokeWidth": "1px"
      },
      "label": {
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    }
  },
  /**
   * - `tone=neutral`: 상태가 특별히 없거나, 상태값이 명확하지 않은 초기 상태
   * - `variant=weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "toneNeutralVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-neutral-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    }
  },
  /**
   * - `tone=neutral`: 상태가 특별히 없거나, 상태값이 명확하지 않은 초기 상태
   * - `variant=solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "toneNeutralVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-800)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-inverted)"
      }
    }
  },
  /**
   * - `tone=neutral`: 상태가 특별히 없거나, 상태값이 명확하지 않은 초기 상태
   * - `variant=outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "toneNeutralVariantOutline": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-neutral-muted)"
      },
      "label": {
        "color": "var(--seed-color-fg-neutral-muted)"
      }
    }
  },
  /**
   * - `variant=weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "toneBrandVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-brand-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-brand-contrast)"
      }
    }
  },
  /**
   * - `variant=solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "toneBrandVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  },
  /**
   * - `variant=outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "toneBrandVariantOutline": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-brand-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-brand)"
      }
    }
  },
  /**
   * - `tone=informative`: 베타 기능 안내, 사용자 권한 제한, 정보 기반 메시지
   * - `variant=weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "toneInformativeVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-informative-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-informative-contrast)"
      }
    }
  },
  /**
   * - `tone=informative`: 베타 기능 안내, 사용자 권한 제한, 정보 기반 메시지
   * - `variant=solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "toneInformativeVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-informative-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  },
  /**
   * - `tone=informative`: 베타 기능 안내, 사용자 권한 제한, 정보 기반 메시지
   * - `variant=outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "toneInformativeVariantOutline": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-informative-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-informative)"
      }
    }
  },
  /**
   * - `tone=positive`: 완료, 적용됨, 승인됨, 발행됨, 저장 성공, 검토 통과
   * - `variant=weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "tonePositiveVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-positive-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-positive-contrast)"
      }
    }
  },
  /**
   * - `tone=positive`: 완료, 적용됨, 승인됨, 발행됨, 저장 성공, 검토 통과
   * - `variant=solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "tonePositiveVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-positive-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  },
  /**
   * - `tone=positive`: 완료, 적용됨, 승인됨, 발행됨, 저장 성공, 검토 통과
   * - `variant=outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "tonePositiveVariantOutline": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-positive-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-positive)"
      }
    }
  },
  /**
   * - `tone=warning`: 만료 임박, 제출 누락, 필수 정보 부족 등 잠재적 문제 상태
   * - `variant=weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "toneWarningVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-warning-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-warning-contrast)"
      }
    }
  },
  /**
   * - `tone=warning`: 만료 임박, 제출 누락, 필수 정보 부족 등 잠재적 문제 상태
   * - `variant=solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "toneWarningVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-warning-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-black-alpha-900)"
      }
    }
  },
  /**
   * - `tone=warning`: 만료 임박, 제출 누락, 필수 정보 부족 등 잠재적 문제 상태
   * - `variant=outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "toneWarningVariantOutline": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-warning-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-warning)"
      }
    }
  },
  /**
   * - `tone=critical`: 검수 거절, 제재 상태, 편집 불가, 유효성 검증 실패
   * - `variant=weak`: 반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.
   */
  "toneCriticalVariantWeak": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-critical-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-critical-contrast)"
      }
    }
  },
  /**
   * - `tone=critical`: 검수 거절, 제재 상태, 편집 불가, 유효성 검증 실패
   * - `variant=solid`: 배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.
   */
  "toneCriticalVariantSolid": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-critical-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  },
  /**
   * - `tone=critical`: 검수 거절, 제재 상태, 편집 불가, 유효성 검증 실패
   * - `variant=outline`: 중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.
   */
  "toneCriticalVariantOutline": {
    "enabled": {
      "root": {
        "strokeColor": "var(--seed-color-stroke-critical-weak)"
      },
      "label": {
        "color": "var(--seed-color-fg-critical)"
      }
    }
  }
}