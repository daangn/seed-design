# @karrotmarket/design-token

디자인 토큰이 무엇인가요?

> Design tokens are indivisible pieces of a design system such as colors, spacing, typography scale. 
>
> -- [Design Token Working Group 정의](https://github.com/design-tokens/community-group)

디자인 토큰은 여러 디자인 도구, 개발환경 간에 디자인 시스템의 최소 단위를 공유할 수 있도록 표준을 제공하는 것을 목표로 합니다.

## Goals & Non-goals

Goal
- [상호운용성](https://en.wikipedia.org/wiki/Interoperability) 제공
- 라이브러리 배포만으로 전체 애플리케이션에 변경 적용
- 디자인 도구와 효율적으로 동기화

Non-goals
- 개발할 때 편하도록 High-level API 제공

## Token Structures

![디자인 토큰 계층구조](design-token-explainer.png)

**Raw values**는 어떤 디스플레이 장치에 그릴 수 있는 실제 단위를 의미합니다. px, dp, rem, vw 와 같이 "크기"를 나타내는 단위, #fff, rgba(123, 123, 123, 1) 처럼 "색상을" 나타내는 단위, "Noto Sans KR" 같은 "폰트"를 나타내는 값 등이 모두 해당됩니다.

사실상 무한한 값들 중에 실제로 사용될 값을 제한하고 고유한 이름을 부여하는 것으로 디자인의 일관성과 재사용성을 얻을 수 있지만, 반대로 디자인의 유연성과 창의성을 크게 제한할 수 있습니다.

당근마켓의 디자인 토큰은 유연성을 위해 크게 2단계로 계층화하여 사용합니다.

**Scale Token**은 Raw value 하나에 이름을 부여한 것 입니다. Scale 의 이름을 통해 전체 디자인에 사용되는 값을 유한하게 유지합니다. Scale은 스스로 정의한 단위를 통해 값의 세부사항(출력장치)을 숨겨 이를 통해 특정 플랫폼에 불가지론적인 디자인을 유지할 수 있게 합니다.

**Semantic Token**은 Scale Token의 조합(Composition)으로 디자인 의도를 표현한 단위이며, 실제 디자인과 개발과정에서 주요 빌딩블럭으로 사용됩니다. 여러개의 Scale 조합이 하나의 Semantic 을 구성할 수도 있고, 여러 Semantic 이 하나의 Scale를 재정의해서 사용될 수도 있습니다.

시스템에 존재하는 Scale 과 Semantic 정의가 전체 디자인의 Theme을 결정하고, 뷰포트나 플랫폼 등 외부 환경에 맞게 Scale에 적절한 값을 주입하는 것으로 스키마 변경없이 유연하게 Theme을 재정의할 수 있습니다.

## 사용법

```bash
yarn add @karrotmarket/design-token
```

### JavaScript (TypeScript)

```ts
import { colors } from '@karrotmarket/design-token';

// raw token
colors.light.scheme

// semantic token
colors.light.semanticScheme
```

### CSS (css-loader)

```ts
import '@karrotmarket/design-token/colors/light.css';
import '@karrotmarket/design-token/colors/dark.css';
```

[Conditional Exports](https://nodejs.org/api/packages.html#packages_conditional_exports) 기능이 지원되지 않는 환경이라면 다음과 같이 사용하세요.

```ts
import '@karrotmarket/design-token/lib/colors/light.css';
import '@karrotmarket/design-token/lib/colors/dark.css';
```

다음과 같이 [CSS Variables](https://developer.mozilla.org/ko/docs/Web/CSS/var()) 값이 추가됩니다.

```css
.light-theme {
  --color-white: #FFF;
  --color-gray100: #F2F3F6;
  --color-gray200: #EAEBEE;
  --color-gray300: #DCDEE3;
  --color-gray400: #D1D3D8;
  --color-gray500: #ADB1BA;
  --color-gray600: #868B94;
  --color-gray700: #4D5159;
  --color-gray900: #212124;
  --color-carrot50: #FFF5F0;
  --color-carrot100: #FFE2D2;
  --color-carrot200: #FFD2B9;
  --color-carrot300: #FFBC97;
  --color-carrot400: #FF9E66;
  --color-carrot500: #FF7E36;
  --color-carrot600: #FA6616;
  --color-yellow50: #FFF7E6;
  --color-yellow500: #FFC552;
  --color-yellow800: #CE6400;
  --color-green50: #E8FAF6;
  --color-green500: #00B493;
  --color-green800: #008C72;
  --color-red50: #FFF3F2;
  --color-red800: #E81300;
  --color-blue50: #EBF7FA;
  --color-blue800: #0A86B7;
  --color-background: var(--color-white);
  --color-background-low: var(--color-gray100);
}

.dark-theme {
  --color-white: #212124;
  --color-gray100: #2B2E33;
  --color-gray200: #34373D;
  --color-gray300: #43474F;
  --color-gray400: #50545C;
  --color-gray500: #6D717A;
  --color-gray600: #868B94;
  --color-gray700: #ADB1BA;
  --color-gray900: #EAEBEE;
  --color-carrot50: #EDE4E0;
  --color-carrot100: #EDD3C4;
  --color-carrot200: #EDC4AD;
  --color-carrot300: #EDB08E;
  --color-carrot400: #EE9561;
  --color-carrot500: #ED7735;
  --color-carrot600: #E96017;
  --color-yellow50: #EDE6D6;
  --color-yellow500: #EDB84E;
  --color-yellow800: #C05F03;
  --color-green50: #D8E9E5;
  --color-green500: #03A88A;
  --color-green800: #03836C;
  --color-red50: #EDE2E2;
  --color-red800: #D81403;
  --color-blue50: #DBE6E9;
  --color-blue800: #0C7EAB;
  --color-background: var(--color-white);
  --color-background-low: #17171A;
}
```

CSS 에서 `color: var(--color-carrot400)` 처럼 쓸 수 있습니다. 

### Theme 적용하기

```html
<div class="light-theme">
  Light 테마가 적용됩니다

  <div class="dark-theme">
    Dark 테마가 적용됩니다
  </div>
</div>
```

Application 환경에서는 JavaScript 를 통해 Theme 을 제어하는 것을 권장합니다.

예시:

```ts
if (window.matchMedia('(prefers-color-scheme: dark)')) {
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
} else {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}
```

시스템 설정만 사용하는 웹 프로젝트에서는 미리 구성된 스타일시트를 import 해서 쓸 수 있습니다.

```ts
import '@karrotmarket/design-token/colors/system.css';
```
