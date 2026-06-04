export declare const vars: {
  /**
   * 주로 전체 페이지 로딩에 사용합니다.
   */
  "size40": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x10)",
        "thickness": "5px"
      }
    }
  },
  /**
   * 특정 요소 안에서 사용하는 경우 사용합니다.
   */
  "size24": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "thickness": "3px"
      }
    }
  },
  /**
   * 대기 시간이 얼마나 남은지 아는 상황일 때 사용합니다. 진행 상황에 맞춰서 원을 채웁니다.
   */
  "indeterminateFalse": {
    "enabled": {
      "range": {
        "lengthDuration": "300ms",
        "lengthTimingFunction": "cubic-bezier(0, 0, 0.15, 1)"
      }
    }
  },
  /**
   * 대기 시간이 얼마나 남은지 모르는 상황일 때 사용합니다. 계속해서 회전하는 동작을 합니다.
   */
  "indeterminateTrue": {
    "enabled": {
      "range": {
        "lengthDuration": "1.2s",
        "rotateDuration": "1.2s",
        "headTimingFunction": "cubic-bezier(0.35, 0, 0.65, 1)",
        "tailTimingFunction": "cubic-bezier(0.35, 0, 0.65, 0.6)",
        "rotateTimingFunction": "cubic-bezier(0.35, 0.25, 0.65, 0.75)"
      }
    }
  },
  /**
   * 가장 보편적으로 사용되며 스타일보다는 로딩 상태의 인식이 더 중요한 경우 사용합니다.
   */
  "toneNeutral": {
    "enabled": {
      "track": {
        "color": "var(--seed-color-palette-gray-200)"
      },
      "range": {
        "color": "var(--seed-color-palette-gray-500)"
      }
    }
  },
  /**
   * 사용자 경험의 초기 단계에서 브랜드 컬러를 통해 주요 전환점을 강조할 때 사용합니다.
   */
  "toneBrand": {
    "enabled": {
      "track": {
        "color": "var(--seed-color-palette-carrot-200)"
      },
      "range": {
        "color": "var(--seed-color-bg-brand-solid)"
      }
    }
  },
  /**
   * 화면 전체를 어둡게 덮는 오버레이(Overlay) 위에 로딩 상태를 표시할 때 사용합니다.
   */
  "toneStaticWhite": {
    "enabled": {
      "track": {
        "color": "var(--seed-color-palette-static-white-alpha-300)"
      },
      "range": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  }
}