# Qvism

## Why Qvism?

UI 라이브러리가 특정 CSS 기술에 의존하는 경우, 라이브러리 사용자의 CSS 기술 선택을 제약하게 됩니다.

런타임을 추가하거나 utility-first CSS를 사용하는 기술은 어떤 방식이건 프로젝트 구성에 영향을 미치게 됩니다.

따라서 Zero-runtime CSS, 특히 Vanilla Extract를 적극적으로 검토했지만 몇 가지 어려움을 확인했습니다:

- 클래스 이름 충돌 방지를 위한 해시 접미사는 불필요합니다.
  - 충돌은 피할 수 있지만, 클래스 이름으로 스타일시트에 직접 접근하기 어렵게 만듭니다.
    - [htmx](https://htmx.org/)와 같은 JavaScript를 최소화하는 접근에서도 쉽게 사용할 수 있어야 합니다.
  - 예기치 않은 클래스 이름 변경은 breaking change로 이어질 수 있습니다.
  - 라이브러리의 고유한 접두사를 사용하는 예측 가능한 클래스 이름만으로 충분합니다.
  - [Custom identifier](https://github.com/vanilla-extract-css/vanilla-extract/pull/1160)를 사용해 해결할 수 있으나, 검토 당시에는 제공되지 않았습니다.
- 구조화된 스타일 선언이 필요합니다.
  - Slot 선언과 같은 기능은 컴포넌트 스타일을 구조적으로 작성하는 데 필수적입니다.
  - [Panda CSS](https://panda-css.com/docs/concepts/slot-recipes), [Tailwind Variants](https://www.tailwind-variants.org/docs/slots)는 좋은 예시를 제공합니다.
  - 하지만, Panda CSS는 [Recipe 선언에 자체적인 디자인 토큰을 활용](https://panda-css.com/docs/concepts/recipes#defining-the-recipe)하고 있지만, SEED 디자인 시스템의 방향성과 일치하지 않았습니다.
    - 특히, [Semantic token에만 conditional이 가능](https://panda-css.com/docs/theming/tokens#semantic-tokens)한 것은 동의할 수 없었습니다.
  - Tailwind Variants는 Tailwind 의존성을 가지게 되어 사용자의 CSS 기술 선택을 제약하게 됩니다.

이러한 관찰을 바탕으로 UI 라이브러리를 위한 스타일 저작 도구가 필요하다는 결론을 내렸습니다.

## Purpose

- Qvism은 UI 라이브러리를 위한 스타일 저작 도구입니다.
- 개별 프로젝트 통합을 위한 기능은 제공하지 않습니다.
  - 이는 Qvism이 간단한 구현을 유지할 수 있게 합니다.
- SEED 디자인 시스템은 Qvism을 시스템 구성에 사용합니다.
  - [Rootage](../rootage/README.md)로 디자인 결정을 선언합니다.
  - Qvism으로 CSS 맥락을 부여해 구조화된 컴포넌트 스타일을 구현합니다.

## When to Use

Qvism은 모든 사례를 위한 도구가 아닙니다:

- 단일 프로젝트를 위한 css 기술이 필요하다면, 이미 훌륭한 기술이 많이 있습니다. Qvism으로 레이어를 추가할 필요는 없습니다.
- 여러 프로젝트에서 사용될 UI 라이브러리를 만들어야 하고, 각 프로젝트의 CSS 기술 선택을 제약하고 싶지 않다면, Qvism이 도움이 될 수 있습니다.

## Prior Arts

- Stitches [Variant API](https://stitches.dev/docs/variants)
- Panda CSS [Slot Recipe API](https://panda-css.com/docs/concepts/slot-recipes)
- Vanilla Extract [createVar API](https://vanilla-extract.style/documentation/api/create-var)