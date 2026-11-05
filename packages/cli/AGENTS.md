# packages/cli

`@seed-design/cli`(`seed-design init/add/add-all/compat/docs`)의 소스와 esbuild 빌드 설정이다. 설정 bootstrap·오류 출력·telemetry·빌드 계약은 [`TECH.md`](TECH.md)에 있다.

## 검증

- 코드 변경 → `bun test packages/cli`. 패키지에는 `test` script가 없으므로 루트에서 경로로 실행한다.
- 번들·실행 확인 → `bun --filter @seed-design/cli build` 후 `node packages/cli/bin/index.mjs <명령>`. `bin/`은 gitignore된 빌드 출력이다.
- dev 번들(`bun cli:watch`)과 번들하지 않은 실행은 registry를 `http://localhost:3000`에서 읽는다(`src/constants.ts`의 `BASE_URL`). 로컬 registry로 확인하려면 docs 개발 서버를 먼저 띄운다.

## 규칙

- `process.exit`는 `src/commands/`에서만 호출한다. `src/utils/`는 종료하지 않고 `src/utils/error.ts`의 `CliError`(실패)나 `CliCancelError`(사용자 취소)를 throw한다 → 명령 파일이 `handleCliError`로 공통 형식 출력한다.
- `seed-design.json`이 없을 때 `seed-design init`을 `execa`로 다시 실행하지 않는다 → `src/utils/init-config.ts`의 내부 init 로직을 호출한다.
- 사용자에게 보이는 메시지는 기존 문구처럼 한국어 해요체로 쓴다(예: `가져왔어요`).
- 상세 디버그 출력은 `src/index.ts`가 등록한 전역 `--verbose` 옵션으로만 켠다. 명령별 디버그 플래그를 새로 만들지 않는다.

## 함께 갱신할 문서

CLI 옵션·동작을 바꾸면 같은 변경에서 실제로 영향받는 문서만 고친다.

- 명령·옵션 → `docs/content/react/getting-started/cli/commands.mdx`
- `seed-design.json` 설정 → `docs/content/react/getting-started/cli/configuration.mdx`
- `skills/seed-design/`의 `SKILL.md`나 `rules/*.md`가 바뀐 명령·설정을 인용함 → 해당 Skill 파일. 그 밖에는 Skill을 건드리지 않는다.
