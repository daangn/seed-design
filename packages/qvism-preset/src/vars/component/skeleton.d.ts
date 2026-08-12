/**
 * SEED가 컴포넌트 스타일을 만들 때 쓰는 내부 값입니다. 공개 API가 아닙니다.
 * minor·patch 업그레이드만으로도 이름이나 구조가 바뀔 수 있습니다.
 * 개별 컴포넌트의 스타일이 필요하면 `recipes/*`를, 값이 필요하면 디자인 토큰(`vars/*`)을 쓰세요.
 *
 * @internal
 */
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
   * 기본값입니다.
   */
  "radius0": {
    "enabled": {
      "root": {
        "cornerRadius": "0px"
      }
    }
  },
  /**
   * 텍스트 콘텐츠에 사용합니다.
   */
  "radius8": {
    "enabled": {
      "root": {
        "cornerRadius": "8px"
      }
    }
  },
  /**
   * 카드 및 썸네일에 사용합니다.
   */
  "radius16": {
    "enabled": {
      "root": {
        "cornerRadius": "16px"
      }
    }
  },
  /**
   * Avatar(원형) 콘텐츠에 사용합니다.
   */
  "radiusFull": {
    "enabled": {
      "root": {
        "cornerRadius": "var(--seed-radius-full)"
      }
    }
  },
  /**
   * 데이터를 불러오는 일반적인 로딩 경험에 사용합니다.
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
   * AI 기능이 활성화되었을 때 사용합니다.
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