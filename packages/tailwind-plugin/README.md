# @seed-design/tailwind-plugin

Seed Design의 디자인 토큰을 Tailwind CSS에서 사용할 수 있도록 해주는 플러그인입니다.

## 설치

```bash
npm install @seed-design/tailwind-plugin
```

## 사용법

`tailwind.config.js` 파일에 플러그인을 추가합니다:

```js
import seedDesign from "@seed-design/tailwind-plugin";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // ...
  plugins: [seedDesign],
};
```

## 클래스 이름

Seed Design 토큰은 `-` 표기법으로 사용할 수 있습니다:

- `bg-palette-gray-1000`: 회색 1000 배경색
- `text-fg-brand`: 브랜드 전경색
- `border-stroke-critical`: 크리티컬 스트로크 색상

## 특징

- Seed Design의 색상 토큰을 Tailwind CSS와 통합
- `.rootage:generate` 스크립트로 자동 업데이트

## 개발

토큰이 업데이트되면 다음 명령어로 플러그인을 업데이트할 수 있습니다:

```bash
npm run rootage:generate
```
