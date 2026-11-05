# packages/cli/src

CLI 진입점(`index.ts`), 명령(`commands/`), 공유 로직(`utils/`), 테스트(`tests/`)가 있다. 오류 처리·`process.exit` 경계는 `packages/cli/AGENTS.md`를 따른다.

## 규칙

- 파일명은 kebab-case로 쓴다. 재수출만 하는 barrel 파일을 만들지 않는다 → 사용처에서 파일을 직접 import한다.
- 테스트는 구현 옆이 아니라 `tests/<대상>.test.ts`에 둔다.

## 작업 절차

새 명령을 추가할 때:

1. `commands/<명령>.ts`에 `CAC` 인스턴스를 받는 `<명령>Command` 함수를 export한다. 예: `commands/add.ts`의 `addCommand`.
2. 같은 파일 상단에 옵션 zod schema를 두고 action 안에서 `safeParse`로 검증한다. 예: `addOptionsSchema`.
3. `index.ts`의 `/* Commands */` 목록에 등록한다.
4. telemetry와 문서 갱신은 `packages/cli/TECH.md`「Telemetry」와 `packages/cli/AGENTS.md`「함께 갱신할 문서」를 따른다.
