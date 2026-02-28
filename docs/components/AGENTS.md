# docs/components

## 디렉토리 개요

문서 사이트 공용 UI 컴포넌트 계층, AI 채팅 패널 전용 규칙은 `ai-panel/AGENTS.md` 관리

## 파일 작성 컨벤션

- 파일/폴더명: `kebab-case`
- 공용 MDX 맵(`mdx-components.tsx`)과 채팅 전용 맵(`ai-panel/chat-mdx-components.tsx`) 분리
- 기능별 하위 폴더 우선, 테스트는 같은 폴더 `*.test.ts`

## 코드 작성 컨벤션

- 문서 본문 렌더링 규칙과 채팅 렌더링 규칙 혼합 금지
- 채팅 전용 로직은 `ai-panel/` 유지, 공용 컴포넌트로 역유입 금지
- MDX 맵 변경 시 적용 대상(문서 본문/채팅) 명확히 구분
