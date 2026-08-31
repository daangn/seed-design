## 디렉토리 개요

`packages/cli`는 `@seed-design/cli` 패키지의 소스와 빌드 설정을 관리하며, `seed-design init/add/add-all/compat` 명령과 `seed-design docs list/search/read` 하위 명령을 제공한다. 사용자 문서는 `docs/content/react/getting-started/cli/`와 동기화하고, 기술 상세는 이 폴더의 `TECH.md`를 우선 참고한다.

## 파일 작성 컨벤션

- 명령어 구현은 `src/commands/*.ts`, 공통 로직은 `src/utils/*.ts`, 검증 스키마는 `src/schema.ts`에 둔다.
- 엔트리포인트는 `src/index.ts` 단일 파일을 유지하고, 빌드 결과물(`bin/`)은 생성물로 취급한다.
- CLI 옵션/동작 변경 시 아래 문서를 함께 갱신한다.
  - `docs/content/react/getting-started/cli/commands.mdx`
  - `docs/content/react/getting-started/cli/configuration.mdx`
  - `.agents/skills/seed-design/SKILL.md`
- 배포 가능한 변경은 `.changeset/*.md`를 함께 추가한다.

## 참고 스킬

`@optique/core`가 배포에 함께 실어 보내는 `optique` 스킬이 `skills-npm`을 통해 이 디렉토리에 걸린다. 파서 코드를 쓰기 전에 그 스킬을 읽는다. 세부는 `skills/AGENTS.md`의 「의존성이 제공하는 스킬」에 있다.

## 코드 작성 컨벤션

- Optique 조합자로 명령을 정의하고, 사용자 대상 메시지는 한국어 톤을 유지한다. 명령 파일은 파서(`xParser`)와 실행 함수(`runX`)를 각각 export 하고, 파서 트리 조립과 분기는 `src/index.ts`가 맡는다.
- 여러 명령이 공유하는 옵션은 `src/utils/cli-options.ts`에 두고, 옵션 값 검증은 zod 스키마가 아니라 Optique 값 파서로 한다. 네트워크로 받은 JSON을 검증하는 `src/schema.ts`는 그대로 zod를 쓴다.
- 예외 처리는 `src/utils/error.ts`의 `CliError`/`CliCancelError`를 사용해 공통 포맷으로 출력한다.
- `process.exit`는 명령어 계층(`src/commands`)에서만 사용하고, `src/utils`에서는 에러를 throw 한다.
- `seed-design.json` 미존재 시 외부 프로세스 실행 대신 내부 init 로직(`src/utils/init-config.ts`)으로 생성한다.
- verbose 디버깅은 글로벌 `--verbose` 옵션을 기준으로 동작시킨다.
