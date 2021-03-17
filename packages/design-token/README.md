# @daangn/design-token

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
yarn add @daangn/design-token
```

### JavaScript (TypeScript)

```ts
import { colors } from '@daangn/design-token';
```

### CSS (css-loader)

```ts
import '@daangn/design-token/colors/light.css';
```
