## 디렉토리 개요

레포 루트 기준 `skills/`는 seed-design 스킬의 단일 원천(source of truth)이다. `.claude/skills`, `.claude/plugins/seed-design/skills`, `.agents/skills` 모두 이 디렉토리로의 symlink이다.

의존성이 자기 패키지 안에 실어 보내는 스킬은 예외다. 그것은 여기 두지 않고 `skills-npm`이 설치 시점에 symlink로 걸어 준다. 아래 「의존성이 제공하는 스킬」을 참고한다.

## 파일 작성 컨벤션

- 저장소 전용 스킬 디렉토리명은 `seed-*` 접두사가 있는 kebab-case를 사용한다.
- 각 스킬 디렉토리는 반드시 `SKILL.md`를 포함한다.
- 부가 자료는 `references/`, `scripts/`, `assets/` 하위에 둔다.
- 신규/수정은 이 디렉토리에서만 수행한다. symlink이므로 별도 동기화 작업은 불필요하다.

## 코드 작성 컨벤션

- `SKILL.md` frontmatter에는 최소 `name`, `description`을 유지한다.
- 스킬 본문에서 참조하는 상대 경로는 스킬 디렉토리 기준으로 작성한다.
- 스킬 간 중복 규칙은 공통 문서로 이동하고, 개별 스킬에는 실행 절차와 예시만 둔다.

## 의존성이 제공하는 스킬

일부 패키지는 자기 `skills/` 디렉토리를 함께 배포한다. 그런 스킬은 이 디렉토리에 복사해 두지 않는다. 손으로 옮기면 라이브러리를 판올림할 때마다 스킬이 뒤처지고, 뒤처졌다는 사실이 드러나지 않는다.

대신 루트 `package.json`의 `prepare` 스크립트가 `skills-npm`을 돌려서 `node_modules` 안의 스킬로 symlink를 건다. `bun install` 때마다 다시 걸리므로 스킬과 라이브러리의 버전이 어긋나지 않는다.

- 링크는 `packages/cli/.claude/skills/npm-<패키지>-<스킬>`에 생기고 `.gitignore`가 무시한다. 커밋되는 것은 `prepare` 스크립트와 무시 규칙뿐이다.
- `--cwd packages/cli`로 범위를 좁혀 둔 이유는, Claude Code가 하위 디렉토리의 `.claude/skills/`를 그 디렉토리 파일을 읽거나 편집할 때 비로소 불러오기 때문이다. CLI 코드를 만지지 않는 세션에서는 목록에 뜨지 않는다.
- `--agents claude-code`로 고정한 이유는, 자동 탐지가 아무 에이전트도 찾지 못하면 CI 밖에서 종료 코드 1로 끝나 `bun install` 전체를 실패시키기 때문이다. 다른 에이전트를 쓴다면 이 목록에 추가한다.
- 새 의존성이 스킬을 싣기 시작하면 자동으로 함께 걸린다. 원하지 않으면 `skills-npm`의 `exclude`로 막는다.
