## 디렉토리 개요

`packages/cli/src`는 CLI 실행 엔트리, 명령어 구현, 공통 유틸, 테스트를 포함한다. 상위 규칙은 `packages/cli/AGENTS.md`를 따르고, 이 문서는 `src` 내부 구조 전용 컨벤션만 정의한다.

## 파일 작성 컨벤션

- `commands/`: 사용자가 직접 호출하는 커맨드 액션(`init`, `add`, `add-all`, `compat`)
- `utils/`: 명령 간 공유 로직(설정, fetch, write, install, analytics, error)
- `tests/`: 독립 단위 테스트
- 파일명은 역할 중심 소문자 kebab-case를 유지하고, barrel file은 만들지 않는다.

## 코드 작성 컨벤션

- 명령어 파일에서 사용자 입출력(`@clack/prompts`)과 종료 코드(`process.exit`)를 최종 처리한다.
- 유틸 파일은 사이드이펙트 종료 대신 예외를 throw하고, 명령어 계층에서 공통 핸들러로 변환한다.
- 사용자 취소는 `CliCancelError`, 오류는 `CliError`로 구분한다.
- 옵션 검증은 zod schema를 명령어 파일 상단에 정의하고 `safeParse/parse`로 검증한다.
