# docs/content/lynx

## 디렉토리 개요

Lynx 플랫폼용 SEED Design 문서. `docs/content/react`와 대응되며, Lynx 전용 컴포넌트 사용법과 가이드를 제공한다.

## 파일 작성 컨벤션

- MDX 파일명은 `kebab-case`를 사용한다.
- Frontmatter에 `title`, `description`을 필수로 포함한다.
- 새 컴포넌트 문서 추가 시 `components/meta.json`의 `pages` 배열에도 등록한다.

## 코드 작성 컨벤션

### 웹(React)과의 차이 비교를 반드시 포함

Lynx 컴포넌트 문서를 작성할 때는 **웹 버전과의 차이점을 반드시 문서화**한다. 사용자가 웹에서 Lynx로 전환할 때 혼란을 줄이기 위해 다음 관점을 확인한다:

- **렌더링 방식 차이**: Lynx에서 지원하지 않는 웹 기능(SVG, 특정 CSS 속성 등)으로 인한 대체 구현
- **애니메이션 차이**: CSS 애니메이션 vs JS 기반 애니메이션
- **API 차이**: props 차이, 컴파운드 컴포넌트 구조 차이, 이벤트 핸들링(`bindtap` 등)
- **누락 기능**: 웹에는 있지만 Lynx에서 미지원인 기능

### 컴포넌트별 웹과의 차이 요약

| 컴포넌트 | 웹 구현 | Lynx 구현 | 핵심 차이 |
|----------|---------|-----------|-----------|
| ProgressCircle | SVG circle + `stroke-dasharray` + CSS 애니메이션 | clip-path 기반 pie sector + JS `setInterval` 애니메이션 | Lynx에서 SVG 미지원으로 완전히 다른 렌더링 방식 |
| ActionButton | `<button>` + headless 로직 | `<view>` + `bindtap` | Lynx에서 `<button>` 미지원, headless 레이어 없음 |
