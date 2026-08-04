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
      "root": {
        "color": "var(--seed-color-bg-brand-solid)"
      },
      "label": {
        "color": "var(--seed-color-palette-static-white)"
      }
    }
  },
  /**
   * 라벨을 포함해 구체적인 알림 수나 상태 정보를 제공합니다. 세부 정보가 중요하고 충분한 공간이 있을 때 사용합니다. 내부 라벨을 반드시 포함해야 합니다.
   */
  "sizeLarge": {
    "enabled": {
      "root": {
        "minWidth": "18px",
        "minHeight": "18px",
        "paddingX": "var(--seed-dimension-x1)",
        "paddingY": "0px",
        "cornerRadius": "var(--seed-radius-full)",
        "iconAttachedInsetEnd": "8px",
        "iconAttachedInsetTop": "14px",
        "textAttachedGap": "2px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t1-static)",
        "lineHeight": "var(--seed-line-height-t1-static)",
        "fontWeight": "var(--seed-font-weight-bold)"
      }
    }
  },
  /**
   * 간결한 도트 형태로, 텍스트 없이 상태 변화만 표시합니다. 알림의 존재 여부만 중요하거나 공간이 제한된 경우에 적합합니다. 내부 라벨은 지원하지 않습니다.
   */
  "sizeSmall": {
    "enabled": {
      "root": {
        "size": "6px",
        "cornerRadius": "var(--seed-radius-full)",
        "iconAttachedInsetEnd": "7px",
        "iconAttachedInsetTop": "7px",
        "textAttachedGap": "2px"
      }
    }
  }
}