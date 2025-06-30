# @seed-design/tailwind3-plugin

SEED 디자인 시스템의 디자인 토큰을 Tailwind CSS 3.x에서 쉽게 사용할 수 있는 플러그인입니다.

## 설치

```bash
npm install @seed-design/tailwind3-plugin
```

또는

```bash
yarn add @seed-design/tailwind3-plugin
```

## 사용 방법

1. 프로젝트에 SEED 디자인 토큰 CSS 파일이 먼저 로드되어 있어야 합니다.
   ```js
   import '@seed-design/css/base.css';
   // or
   import '@seed-design/css/all.css';
   ```

2. Tailwind CSS 구성 파일에 플러그인을 추가합니다.
   ```js
   // tailwind.config.js
   import seedPlugin from '@seed-design/tailwind3-plugin';
   
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [seedPlugin],
   };
   ```

## 유틸리티 클래스

SEED 디자인 시스템의 모든 디자인 토큰은 다음과 같은 유틸리티 클래스로 사용 가능합니다:

### 색상 유틸리티
```jsx
// 텍스트 색상
<p className="text-fg-brand">브랜드 색상 텍스트</p>
<p className="text-fg-neutral">기본 텍스트 색상</p>
<p className="text-palette-blue-500">팔레트 색상 텍스트</p>

// 배경 색상
<div className="bg-bg-layer-basement">레이어 베이스먼트 배경</div>
<div className="bg-palette-gray-100">회색 배경</div>

// 테두리 색상
<div className="border border-stroke-brand">브랜드 테두리</div>
<div className="border border-palette-red-500">팔레트 테두리</div>
```

### 타이포그래피 유틸리티
```jsx
<h1 className="screen-title">화면 제목</h1>
<p className="t3-regular">본문 텍스트</p>
<p className="article-body">아티클 본문</p>
```

### 크기 및 여백 유틸리티
```jsx
// 크기 유틸리티
<div className="size-x4">정사각형 요소</div>
<div className="w-x8 h-x4">직사각형 요소</div>

// 여백 유틸리티
<div className="p-x2">패딩 사용</div>
<div className="px-x4 py-x2">수평/수직 패딩</div>
<div className="m-x2">마진 사용</div>
<div className="mx-auto">중앙 정렬</div>

// 간격 유틸리티
<div className="flex gap-x3">아이템 간격 설정</div>
<div className="grid gap-x-x4 gap-y-x2">그리드 간격 설정</div>
```

### 테두리 반경
```jsx
<div className="radius-r2">표준 둥근 모서리</div>
<div className="radius-r4">큰 둥근 모서리</div>
<button className="radius-r8">매우 둥근 버튼</button>
```

### 그라데이션 유틸리티
```jsx
// 방향성 그라데이션 배경
<div className="bg-shimmer-neutral-to-r">우측으로 그라데이션</div>
<div className="bg-shimmer-magic-to-b">아래로 그라데이션</div>
<div className="bg-shimmer-neutral-to-tr">우측 상단으로 그라데이션</div>

// 임의 각도 그라데이션 (새로 추가)
<div className="bg-gradient-shimmer-neutral-[45deg]">45도 각도 그라데이션</div>
<div className="bg-gradient-glow-magic-[120deg]">120도 각도 그라데이션</div>
<div className="bg-gradient-highlight-magic-[270deg]">270도 각도 그라데이션</div>
```

## 지원하는 토큰

이 플러그인은 다음과 같은 SEED 디자인 토큰을 지원합니다:

- 색상 (fg-*, bg-*, stroke-*, palette-*)
- 그라데이션 (bg-gradient-{gradient-stops-name}-to-t, bg-gradient-{gradient-stops-name}-to-r, bg-gradient-{gradient-stops-name}-to-b, bg-gradient-{gradient-stops-name}-to-l, bg-gradient-{gradient-stops-name}-to-tr, bg-gradient-{gradient-stops-name}-to-br, bg-gradient-{gradient-stops-name}-to-bl, bg-gradient-{gradient-stops-name}-to-tl)
- 그라데이션 임의 각도 (bg-gradient-{gradient-stops-name}-45deg, bg-gradient-{gradient-stops-name}-120deg, bg-gradient-{gradient-stops-name}-270deg 등)
- 크기 (dimension-x*)
- 여백 (p-x*, m-x*, gap-x*)
- 반경 (radius-r*)
- 글꼴 크기 (text-size-*)
- 글꼴 두께 (font-*)
- 줄 높이 (leading-*)
- 애니메이션 지속 시간 (duration-d*)
- 타이밍 함수 (easing-*)
- 타이포그래피 스타일 (t1-regular, t1-bold, t2-regular, ...etc)

## 버전 호환성

이 패키지는 Tailwind CSS 3.x 버전에서 사용할 수 있습니다. Tailwind CSS 4.0 이상 버전은 `@seed-design/tailwind4`를 사용하세요.
