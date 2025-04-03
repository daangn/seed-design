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

### 색상 토큰
Seed Design 색상 토큰은 다음과 같이 사용할 수 있습니다:

- `bg-bg-layer-basement`: 레이어 베이스먼트 배경색 
- `bg-palette-gray-1000`: 회색 1000 배경색
- `text-fg-brand`: 브랜드 텍스트 색상
- `border-stroke-critical`: 크리티컬 테두리 색상

### 타이포그래피 토큰
타이포그래피 토큰은 클래스 이름으로 직접 사용할 수 있습니다:

- `t1Regular`: 텍스트 스타일 1 레귤러
- `t1Medium`: 텍스트 스타일 1 미디엄
- `t1Bold`: 텍스트 스타일 1 볼드
- `screenTitle`: 스크린 타이틀 스타일
- `articleBody`: 아티클 바디 스타일

```jsx
// 예시
<div className="t3Bold text-fg-brand">안녕하세요</div>
<h1 className="screenTitle bg-bg-layer-basement">제목</h1>
```

## 특징

- Seed Design의 색상 및 타이포그래피 토큰을 Tailwind CSS와 통합
- 다크 모드 자동 지원 (CSS 변수 기반)
- `.rootage:generate` 스크립트로 자동 업데이트

## 개발

토큰이 업데이트되면 다음 명령어로 플러그인을 업데이트할 수 있습니다:

```bash
npm run rootage:generate
```

또는 여러 YAML 파일을 지정하여 타이포그래피와 색상을 함께 생성할 수 있습니다:

```bash
npx rootage tailwind-plugin --file color.yaml typography.yaml --output ./packages/tailwind-plugin/src/index.ts
```

## 지원 기능

- [x] Color (fg, bg, stroke, palette, manner-temp)
- [x] Typography (Font Size, Font Weight, Line Height)
- [ ] Gradient (일부 지원)
- [ ] Dimension
- [ ] Radius
- [ ] Motion (Timing Function, Duration)
