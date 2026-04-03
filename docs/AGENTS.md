# docs

## 디렉토리 개요

SEED Design **문서 사이트**. Next.js + Fumadocs 기반. 컴포넌트 문서, 디자인 가이드라인, Storybook을 제공한다. `content/` 구조 변경 시 `packages/docs-mcp/src/config.ts` 동기화 필수.

## 파일 작성 컨벤션

- 문서는 역할 중심 도메인으로 분리하고, 새로운 문서 영역 추가 시 관련 매핑/동기화 규칙을 함께 갱신한다.
- MDX 파일명은 `kebab-case`를 사용한다.

## 코드 작성 컨벤션

- Frontmatter에 `title`, `description`을 필수로 포함한다.
- 문서 UI와 스토리는 문서 본문과 분리된 참조 계층으로 관리한다.
- **`docs/registry/{react,lynx}/ui/`의 snippet 레이어 변경은 최소한으로 한다.** snippet은 사용자가 직접 커스터마이징하는 레이어이므로, 불필요한 변경은 사용자 코드에 영향을 줄 수 있다.
- **`content/` 하위에 AGENTS.md를 두지 않는다.** fumadocs가 `content/` 전체를 스캔하여 `.md` 파일을 문서 콘텐츠로 인식하므로 frontmatter 에러가 발생한다.

### Lynx 문서 작성 가이드 (`content/lynx/`)

Lynx 컴포넌트 문서를 작성할 때는 **웹 버전과의 차이점을 반드시 문서화**한다. 사용자가 웹에서 Lynx로 전환할 때 혼란을 줄이기 위해 다음 관점을 확인한다:

- **렌더링 방식 차이**: Lynx에서 지원하지 않는 웹 기능(SVG, 특정 CSS 속성 등)으로 인한 대체 구현
- **애니메이션 차이**: CSS 애니메이션 vs JS 기반 애니메이션
- **API 차이**: props 차이, 컴파운드 컴포넌트 구조 차이, 이벤트 핸들링(`bindtap` 등)
- **누락 기능**: 웹에는 있지만 Lynx에서 미지원인 기능

#### 컴포넌트별 웹과의 차이 요약

| 컴포넌트 | 웹 구현 | Lynx 구현 | 핵심 차이 |
|----------|---------|-----------|-----------|
| ProgressCircle | SVG circle + `stroke-dasharray` + CSS 애니메이션 | clip-path 기반 pie sector + JS `setInterval` 애니메이션 | Lynx에서 SVG 미지원으로 완전히 다른 렌더링 방식 |
| ActionButton | `<button>` + headless 로직 | `<view>` + `bindtap` | Lynx에서 `<button>` 미지원, headless 레이어 없음 |
