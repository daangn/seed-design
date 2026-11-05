# @seed-design/tailwind4-theme

SEED 디자인 시스템의 디자인 토큰을 Tailwind CSS 4.0에서 사용할 수 있게 해주는 CSS 파일을 제공합니다.

## 설치

웹에서는 `@seed-design/css`, Lynx에서는 `@seed-design/lynx-css`를 함께 설치하세요. 두 패키지는 optional peer이므로 패키지 매니저가 둘 중 하나의 설치를 강제하지 않습니다. 플랫폼에 맞는 패키지를 직접 설치하고 토큰 CSS를 import해야 합니다.

```bash
# 웹
bun add @seed-design/tailwind4-theme @seed-design/css tailwindcss@4

# Lynx
bun add @seed-design/tailwind4-theme @seed-design/lynx-css tailwindcss@4
```

웹 CSS peer 범위는 `^2.7.0`입니다. 이 버전부터 theme이 참조하는 `--seed-gradient-fade-mask` 토큰을 제공합니다.

Lynx의 전체 설정과 제한사항은 [Lynx Tailwind 가이드](https://seed-design.io/lynx/getting-started/styling/tailwind-css-4)를 참고하세요. 아래 예제는 웹 기준입니다.

## 사용 방법

1. 프로젝트에 SEED 디자인 토큰 CSS 파일이 먼저 로드되어 있어야 합니다.
   ```js
   import '@seed-design/css/base.css';
   // 또는 컴포넌트 스타일까지 포함
   import '@seed-design/css/all.css';
   // Lynx에서는 위 웹 CSS 대신 사용
   // import '@seed-design/lynx-css/base.css';
   ```

2. CSS 파일에 Tailwind CSS와 SEED 디자인 토큰을 가져옵니다.
   ```css
   /* index.css 또는 main.css 등 */
   @import "tailwindcss";
   @import "@seed-design/tailwind4-theme";
   ```

3. 이제 SEED 디자인 토큰 변수들이 Tailwind CSS 4.0의 테마에 등록되며, 다음과 같은 유틸리티 클래스를 사용할 수 있습니다.

## 유틸리티 클래스

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
<div className="border border-stroke-brand-solid">브랜드 테두리</div>
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
<div className="grid gap-y-x2 gap-x-x4">그리드 간격 설정</div>
```

### 테두리 반경
```jsx
<div className="radius-r2">표준 둥근 모서리</div>
<div className="radius-r4">큰 둥근 모서리</div>
<button className="radius-full">매우 둥근 버튼</button>
```

### 그라데이션 유틸리티

파운데이션의 `fade-mask`, `glow-magic`, `glow-magic-pressed`, `highlight-magic`, `highlight-magic-pressed`, `shimmer-magic`, `shimmer-neutral`을 지원합니다.

```jsx
// 8방향: t, tr, r, br, b, bl, l, tl. 두 이름 모두 지원합니다.
<div className="bg-shimmer-neutral-to-r">우측으로 그라데이션</div>
<div className="bg-gradient-shimmer-neutral-to-r">같은 우측 그라데이션</div>
<div className="bg-gradient-fade-mask-to-b">아래로 fade 배경</div>

// 각도는 대괄호 문법을 사용합니다.
<div className="bg-gradient-glow-magic-[120deg]">120도 그라데이션</div>

// 소수, 음수, 다른 angle 단위도 사용할 수 있습니다.
<div className="bg-gradient-shimmer-neutral-[45.5deg]">45.5도</div>
<div className="bg-gradient-highlight-magic-[-45deg]">-45도</div>
<div className="bg-gradient-glow-magic-[0.25turn]">0.25회전</div>
```

`bg-gradient-{token}-45deg`처럼 대괄호 없는 각도 표기는 지원하지 않습니다. `bg-gradient-{token}-[45deg]`를 사용하세요.

그라데이션은 토큰 CSS의 `--seed-gradient-*`를 참조하므로 light/dark 모드에 맞는 색상 stop을 사용합니다. `fade-mask`는 두 모드에서 같은 16개 alpha stop을 사용합니다. 위 클래스는 모두 `background-image`이며, `fade-mask` 클래스가 요소에 마스크를 적용하는 것은 아닙니다.

## 지원하는 토큰

이 패키지는 모든 SEED 디자인 토큰을 Tailwind CSS 4.0의 테마 변수로 제공합니다:

- 색상 (fg-*, bg-*, stroke-*, palette-*)
- 그라데이션 방향 (`bg-{token}-to-{direction}`, `bg-gradient-{token}-to-{direction}`)
- 그라데이션 임의 각도 (`bg-gradient-{token}-[<angle>]`)
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

이 패키지는 Tailwind CSS 4.0 이상 버전에서만 사용할 수 있습니다. Tailwind CSS 3.x 버전은 `@seed-design/tailwind3-plugin`을 사용하세요.
