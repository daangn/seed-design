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
        "gap": "var(--seed-dimension-x2)"
      },
      "header": {
        "paddingX": "var(--seed-dimension-x0_5)",
        "gap": "var(--seed-dimension-x2_5)"
      },
      /** 필수 입력 필드임을 나타내는 아이콘입니다. indicatorText 및 Field Label과의 조화를 위해 폰트 스케일링에 반응합니다. */
      "indicatorIcon": {
        "color": "var(--seed-color-fg-critical)",
        "size": "0.375rem",
        "paddingTop": "0.25rem",
        "paddingLeft": "0.125rem"
      },
      "indicatorText": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontSize": "var(--seed-font-size-t4)",
        /** Field Label과의 조화를 위해 Field Label의 lineHeight와 동일한 값을 갖습니다. */
        "lineHeight": "var(--seed-line-height-t5)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "paddingLeft": "0.25rem"
      },
      "footer": {
        "paddingX": "var(--seed-dimension-x0_5)",
        "gap": "var(--seed-dimension-x2)"
      },
      "description": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t4)",
        /** Field Label과의 조화를 위해 Field Label의 lineHeight와 동일한 값을 갖습니다. */
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "descriptionIcon": {
        "paddingRight": "var(--seed-dimension-x1_5)",
        "color": "var(--seed-color-fg-neutral-subtle)",
        "size": "var(--seed-dimension-x4)"
      },
      "errorMessage": {
        "color": "var(--seed-color-fg-critical)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t4)",
        /** Field Label과의 조화를 위해 Field Label의 lineHeight와 동일한 값을 갖습니다. */
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "errorIcon": {
        "paddingRight": "var(--seed-dimension-x1_5)",
        "color": "var(--seed-color-fg-critical)",
        "size": "var(--seed-dimension-x4)"
      },
      "characterCount": {
        "color": "var(--seed-color-fg-neutral)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t4)",
        /** Field Label과의 조화를 위해 Field Label의 lineHeight와 동일한 값을 갖습니다. */
        "lineHeight": "var(--seed-line-height-t4)"
      },
      "maxCharacterCount": {
        "color": "var(--seed-color-fg-neutral-subtle)",
        "fontWeight": "var(--seed-font-weight-regular)",
        "fontSize": "var(--seed-font-size-t4)",
        /** Field Label과의 조화를 위해 Field Label의 lineHeight와 동일한 값을 갖습니다. */
        "lineHeight": "var(--seed-line-height-t4)"
      }
    },
    "invalid": {
      "characterCount": {
        "color": "var(--seed-color-fg-critical)"
      },
      "maxCharacterCount": {
        "color": "var(--seed-color-fg-critical)"
      }
    }
  }
}