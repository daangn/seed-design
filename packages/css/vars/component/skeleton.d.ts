export declare const vars: {
  "base": {
    "enabled": {
      "shimmer": {
        "duration": "1.5s",
        "timingFunction": "var(--seed-timing-function-easing)"
      }
    }
  },
  /**
   * - `radius=0`: 기본값입니다.
   */
  "radius0": {
    "enabled": {
      "root": {
        "cornerRadius": "0px"
      }
    }
  },
  /**
   * - `radius=8`: 텍스트 콘텐츠에 사용합니다.
   */
  "radius8": {
    "enabled": {
      "root": {
        "cornerRadius": "8px"
      }
    }
  },
  /**
   * - `radius=16`: 카드 및 썸네일에 사용합니다.
   */
  "radius16": {
    "enabled": {
      "root": {
        "cornerRadius": "16px"
      }
    }
  },
  /**
   * - `radius=full`: Avatar(원형) 콘텐츠에 사용합니다.
   */
  "radiusFull": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-full)"
      }
    }
  },
  /**
   * - `tone=neutral`: 데이터를 불러오는 일반적인 로딩 경험에 사용합니다.
   */
  "toneNeutral": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-palette-gray-200)"
      },
      "shimmer": {
        "gradient": "var(--seed-gradient-shimmer-neutral)"
      }
    }
  },
  /**
   * - `tone=magic`: AI 기능이 활성화되었을 때 사용합니다.
   */
  "toneMagic": {
    "enabled": {
      "root": {
        "color": "var(--seed-color-bg-magic-weak)"
      },
      "shimmer": {
        "gradient": "var(--seed-gradient-shimmer-magic)"
      }
    }
  }
}