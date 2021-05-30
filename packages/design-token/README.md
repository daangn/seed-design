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

## 사용법

```bash
yarn add @karrotmarket/design-token
```

### JavaScript (TypeScript)

```ts
import { colors } from '@daangn/design-token';

// raw token
colors.light.scheme

// semantic token
colors.light.semanticScheme
```

### CSS (css-loader)

```ts
import '@daangn/design-token/colors/light.css';

// [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports) 기능이 지원되지 않는 환경이라면 다음과 같이 사용하세요.
import '@daangn/design-token/lib/colors/light.css';
```

전역에 다음과 같이 [CSS Variables](https://developer.mozilla.org/ko/docs/Web/CSS/var()) 값이 추가됩니다.

```css
:root {
  --color-white: #fff;
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
```

CSS 에서 `color: var(--color-carrot400)` 처럼 쓸 수 있습니다. 
