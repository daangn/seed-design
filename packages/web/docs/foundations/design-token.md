---
sidebar_position: 1
---

# Design Token

디자인 토큰이 무엇인가요?

> Design tokens are indivisible pieces of a design system such as colors, spacing, typography scale. 
>
> -- [Design Token Working Group 정의](https://github.com/design-tokens/community-group)

디자인 토큰은 여러 디자인 도구, 개발환경 간에 디자인 시스템의 최소 단위를 공유할 수 있도록 표준을 제공하는 것을 목표로 합니다.

## Goals

- [상호운용성](https://en.wikipedia.org/wiki/Interoperability) 제공
- 라이브러리 배포만으로 전체 애플리케이션에 변경 적용
- 디자인 도구와 효율적으로 동기화

## Token Structures

Seed Design 의 디자인 토큰은 [KDT](https://github.com/daangn/kdt)를 통해 정의되고, 그 의미론을 따릅니다.

![디자인 토큰 계층구조](design-token-explainer.png)

**Raw values**는 어떤 디스플레이 장치에 그릴 수 있는 실제 값을 의미합니다. `1px`, `1dp`, `1rem`, `1vw` 와 같이 크기를 나타내는 값, `#fff`, `rgba(123, 123, 123, 1)` 처럼 색상을 나타내는 값, `"Noto Sans KR"` 같은 폰트를 나타내는 값 등이 모두 해당됩니다.

사실상 무한한 값들 중에 실제로 사용될 값을 제한하고 고유한 이름을 부여하는 것으로 디자인의 일관성과 재사용성을 얻을 수 있지만, 반대로 디자인의 유연성과 창의성을 크게 제한할 수 있습니다.

당근마켓의 디자인 토큰은 유연성을 위해 크게 2단계로 계층화하여 사용합니다.

**Scale Token**은 Raw value Scale 하나에 이름을 부여한 것 입니다. Scale 의 이름을 통해 전체 디자인에 사용되는 값을 유한하게 유지합니다. Scale은 미리 정의한 단위를 통해 값의 세부사항(출력장치)을 숨겨 이를 통해 특정 플랫폼에 불가지론적인 디자인을 유지할 수 있게 합니다.

**Semantic Token**은 Scale Token의 조합(Composition)으로 디자인 의도를 표현한 단위이며, 실제 디자인과 개발과정에서 주요 빌딩블럭으로 사용됩니다. 여러개의 Scale 조합이 하나의 Semantic Token 을 구성할 수도 있고, 여러 Semantic 이 하나의 Scale를 재정의해서 사용될 수도 있습니다.

시스템에 존재하는 Scale 과 Semantic 정의가 전체 디자인의 스킴을 결정하고, 뷰포트나 플랫폼 등 외부 환경에 맞게 Scale에 적절한 값을 주입하는 것으로 스키마 변경없이 유연하게 스킴을 재정의할 수 있습니다.

## 사용법

```bash
yarn add @seed-design/design-token
```

### JavaScript (TypeScript)

```ts
import { vars } from '@seed-design/design-token';

// 시맨틱 토큰
vars.$semantic.color.primary;

// 스케일 토큰
vars.$scale.color.carrot500;

// 스태틱(단일 스케일) 토큰
vars.$static.color.carrot500;

// 컴포넌트 토큰
vars.$component.typography.h1;
```
