# docs

## 디렉토리 개요

SEED Design **문서 사이트**. Next.js + Fumadocs 기반. 컴포넌트 문서, 디자인 가이드라인, Storybook을 제공한다. `content/` 구조 변경 시 `packages/docs-mcp/src/config.ts` 동기화 필수.

## 파일 작성 컨벤션

- `content/react/`: React 컴포넌트 문서
- `content/docs/`: 디자인 가이드라인
- `content/breeze/`: Breeze 컴포넌트
- `content/ai-integration/`: AI 도구 연동 가이드
- MDX 파일명: `kebab-case.mdx`

## 코드 작성 컨벤션

- Frontmatter 필수: `title`, `description`
- 문서 UI 컴포넌트: `components/`
- Storybook 스토리: `stories/`
