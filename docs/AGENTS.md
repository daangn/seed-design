# docs

## 디렉토리 개요

SEED Design 문서 사이트, Next.js + Fumadocs 기반, 컴포넌트 문서/가이드 제공

## 파일 작성 컨벤션

- 문서: 역할 중심 도메인 분리
- MDX 파일명: `kebab-case`
- 세부 컨벤션: 하위 AGENTS 관리

## 코드 작성 컨벤션

- 문서 본문 Frontmatter: `title`, `description` 필수
- 문서 본문 렌더링 계층과 채팅 렌더링 계층 분리
- AI 상세 규칙: 아래 하위 문서 우선
  - `docs/components/AGENTS.md`
  - `docs/components/ai-panel/AGENTS.md`
  - `docs/lib/ai/AGENTS.md`
  - `docs/app/api/AGENTS.md`
