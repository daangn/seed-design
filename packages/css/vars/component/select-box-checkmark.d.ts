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
        "size": "var(--seed-dimension-x5)"
      },
      "icon": {
        "size": "15px",
        "color": "var(--seed-color-fg-placeholder)",
        "colorDuration": "var(--seed-duration-color-transition)",
        "colorTimingFunction": "var(--seed-timing-function-easing)"
      }
    },
    "pressed": {
      "icon": {
        "color": "var(--seed-color-fg-neutral-subtle)"
      }
    },
    "enabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "enabledSelectedPressed": {
      "icon": {
        "color": "var(--seed-color-fg-neutral)"
      }
    },
    "disabled": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    },
    "disabledSelected": {
      "icon": {
        "color": "var(--seed-color-fg-disabled)"
      }
    }
  }
}