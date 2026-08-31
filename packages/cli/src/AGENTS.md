## 디렉토리 개요

`packages/cli/src`는 CLI 실행 엔트리, 명령어 구현, 공통 유틸, 테스트를 포함한다. 상위 규칙은 `packages/cli/AGENTS.md`를 따르고, 이 문서는 `src` 내부 구조 전용 컨벤션만 정의한다.

## 파일 작성 컨벤션

- `commands/`: 사용자가 직접 호출하는 커맨드(`init`, `add`, `add-all`, `compat`, `docs`). 파일마다 파서(`xParser`)와 실행 함수(`runX`)를 각각 export 한다.
- `utils/`: 명령 간 공유 로직(설정, fetch, write, install, analytics, error, 공유 옵션 파서)
- `tests/`: 독립 단위 테스트
- 파일명은 역할 중심 소문자 kebab-case를 유지하고, barrel file은 만들지 않는다.

## 코드 작성 컨벤션

- 명령어 파일에서 사용자 입출력(`@clack/prompts`)과 종료 코드(`process.exit`)를 최종 처리한다.
- 유틸 파일은 사이드이펙트 종료 대신 예외를 throw하고, 명령어 계층에서 공통 핸들러로 변환한다.
- 사용자 취소는 `CliCancelError`, 오류는 `CliError`로 구분한다.
- 옵션은 Optique 조합자로 선언하고, 값 검증은 값 파서(`choice`, `path` 등)가 맡는다. 파서가 이미 보장한 모양을 zod로 다시 검증하지 않는다. 네트워크로 받은 JSON을 검증하는 `schema.ts`는 별개다.
- 파서 트리 조립과 분기는 `index.ts`가 전담한다. 실행 함수는 파싱된 값만 받으므로 파서를 거치지 않고 직접 호출할 수 있고, 테스트가 그렇게 쓴다.
