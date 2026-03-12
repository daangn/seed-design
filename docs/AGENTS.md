# docs

## 디렉토리 개요

SEED Design **문서 사이트**. Next.js + Fumadocs 기반. 컴포넌트 문서, 디자인 가이드라인, Storybook을 제공한다. `content/` 구조 변경 시 `packages/docs-mcp/src/config.ts` 동기화 필수.

## 파일 작성 컨벤션

- 문서는 역할 중심 도메인으로 분리하고, 새로운 문서 영역 추가 시 관련 매핑/동기화 규칙을 함께 갱신한다.
- MDX 파일명은 `kebab-case`를 사용한다.

## 코드 작성 컨벤션

- Frontmatter에 `title`, `description`을 필수로 포함한다.
- 문서 UI와 스토리는 문서 본문과 분리된 참조 계층으로 관리한다.
- **`docs/registry/ui/`의 snippet 레이어 변경은 최소한으로 한다.** snippet은 사용자가 직접 커스터마이징하는 레이어이므로, 불필요한 변경은 사용자 코드에 영향을 줄 수 있다.
