# ecosystem

## 디렉토리 개요

SEED Design의 생성 파이프라인을 담당하는 CLI/코어 워크스페이스다. `packages/rootage`, `packages/qvism-preset`, `packages/figma`를 입력으로 받아 코드 생성에 필요한 실행 로직을 제공한다.

## 파일 작성 컨벤션

- 도구별 워크스페이스는 `core/`와 `cli/`를 분리한다.
- 실행 진입점과 옵션 파싱은 `cli/`, 변환/파싱/출력 로직은 `core/`에 둔다.
- 생성 대상 경로(`packages/css/vars`, `packages/css/recipes`, `packages/qvism-preset/src/vars`)는 출력물로 취급한다.

## 코드 작성 컨벤션

- 생성 로직은 source 패키지(`packages/rootage`, `packages/qvism-preset`)를 기준으로 작성하고 출력 파일 역수정에 의존하지 않는다.
- 전체 검증은 `bun generate:all`, 단계별 검증은 `bun rootage:generate`와 `bun qvism:generate`를 우선 사용한다.
- CLI와 core는 TypeScript ESM 패턴을 유지하고 공통 타입을 명시적으로 공유한다.
