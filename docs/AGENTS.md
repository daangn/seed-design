# docs

## 디렉토리 개요

SEED Design 문서 사이트, Next.js + Fumadocs 기반, 컴포넌트 문서/가이드 제공
AI Agent 런타임/툴 오케스트레이션 기술 상세는 `docs/TECH.md`를 단일 기준으로 참고한다.

## 파일 작성 컨벤션

- 문서: 역할 중심 도메인 분리
- MDX 파일명: `kebab-case`
- 세부 컨벤션: 하위 AGENTS 관리

## 코드 작성 컨벤션

- 문서 본문 Frontmatter: `title`, `description` 필수
- 문서 본문 렌더링 계층과 채팅 렌더링 계층 분리
- AI 관련 규칙을 변경할 때는 `AGENTS.md`에 절차만 기록하고, 기술 상세/결정 근거는 `docs/TECH.md`에 작성한다.
- AI 상세 규칙: 아래 하위 문서 우선
  - `docs/components/AGENTS.md`
  - `docs/components/ai-panel/AGENTS.md`
  - `docs/lib/ai/AGENTS.md`
  - `docs/app/api/AGENTS.md`
