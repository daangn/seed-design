# Karrot UI → Seed Design 마이그레이션 가이드

## 주요 변경 사항

- 프로젝트/디자인 시스템 명이 **Seed Design**으로 리브랜딩 됩니다.
- 패키지 명이 `@seed-design/*` 으로 변경됩니다.
- `@karrot-ui/*` packages are deprecated.
- `color-scheme: light dark` 지원이 기본값이 됩니다.
- 디자인 토큰이 [KDT](https://github.com/daangn/kdt/tree/main/language) 의미론을 따릅니다.

## 공통 가이드

### HTML 메타태그 삽입하기

참고: https://web.dev/i18n/ko/color-scheme/#color-scheme

애플리케이션이 지원하는 컬러 스킴을 브라우저에게 여러 방법으로 알릴 수 있습니다. 그 중 메타태그를 사용하는 것이 가장 빠른 방법이므로 가능한 경우 명시하는 것을 권장합니다.

```html
<meta name="color-scheme" content="light dark">
```

### CSS 스타일시트 로딩하기 (DOM)

웹 브라우저에서 실행되는 경우 Seed Design 의 모든 속성 정의는 [CSS Variables](https://developer.mozilla.org/ko/docs/Web/CSS/Using_CSS_custom_properties)를 통해 제공됩니다.

Seed Design의 스타일시트 리소스를 사용할 수 있도록 우선 로딩 해야합니다.

```html
<!-- 브라우저가 자산을 우선적으로 처리하도록 preload 표시 -->
<link rel="preload" href="uri/to/global.css" as="style">

<link rel="stylesheet" href="uri/to/global.css">
```

웹팩 등 자바스크립트 번들러에 의해 처리되는 경우, [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/) 등으로 사전에 추출되어 [주요 렌더링 경로](https://developer.mozilla.org/ko/docs/Web/Performance/Critical_rendering_path)에 배치해야합니다.

```js
import '@seed-design/stylesheet/global.css';
```

#### 루트 엘리먼트(`<html>`) 초기화

Seed Design 에서 제공하는 속성은 사용하기 전에 **명시적인 초기화**가 필요합니다.

- 페이지 루트 요소에 `data-seed` 어트리뷰트를 지정합니다.
- 사용자가 선호하는 컬러 스킴에 따라 `data-seed-scale-color` 어트리뷰트를 지정합니다.

**예시) HTML (light-only)**

```html
<html lang="ko" data-seed="light-only" data-seed-scale-color="light">
  <head>
    <meta name="color-scheme" content="light">
  </head>
</html>
```

**예시) DOM API로 동적 초기화**

(CSS-in-JS 라이브러리 통합 시, 또는 pre-hydration 스크립트에서 수행 될 수 있습니다)

```js
(function() {
  var el = document.documentElement;
  el.dataset.seed = '';

  function apply() {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    el.dataset.seedColorScale = mq.matches ? 'dark' : 'light';
  }
  mq.addEventListener('change', apply);
  apply();
})();
```

**예시) [react-helmet-async](https://github.com/staylor/react-helmet-async)로 동적 초기화**

```jsx
import { Helmet } from 'react-helmet-async';
import { useColorScale } from '@seed-design/react-dom-theminig';

const Header = () => {
  const colorScale = useColorScale();
  return (
    <Helmet>
      <html
        lang="ko"
        data-seed=""
        data-seed-color-scale={colorScale}
      >
    <Helmet>
  );
};
```

## 프레임워크 별 가이드

### Emotion

TBD

### Styled-Components

TBD

### Linaria

TBD

### vanilla-extract

TBD

### Stitches.js

```ts
// stitches.config.ts

import { vars, adapters } from '@seed-design/design-token';
import { createStitches } from '@stitches/react';

const theme = adapters.stitches.toStitchesTheme(vars);

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    ...theme,
    // ...overrides
    colors: {
      ...theme.colors,
      // ...overrides
    },
  },
});
```

### Tailwind CSS

TBD

### React Native

TBD

## 서버 사이드 렌더링 가이드

TBD

