## 디렉토리 개요

레포 루트의 `skills/`는 저장소 전용 Skill의 단일 원천이다. `.claude/skills`, `.claude/plugins/seed-design/skills`, `.agents/skills`는 이 디렉터리를 가리키는 symlink이므로 여기만 수정한다.

의존성이 자기 패키지 안에 실어 보내는 스킬은 예외다. 그것은 여기 두지 않고 `skills-npm`이 설치 시점에 symlink로 걸어 준다. 아래 「의존성이 제공하는 스킬」을 참고한다.

## 파일 작성 컨벤션

- Skill 디렉터리명은 `seed-*` 접두사의 kebab-case를 사용한다. 각 디렉터리는 `SKILL.md`를 포함한다.
- 부가 자료는 해당 Skill의 `references/`, `scripts/`, `assets/` 아래에 둔다. 상대 경로는 Skill 디렉터리를 기준으로 쓴다.
- 새 규칙을 추가할 때는 가장 좁은 적용 범위에 둔다. 여러 Skill이 공유하는 규칙은 이 파일이나 별도 공통 reference로 올리고 중복하지 않는다.

## 코드 작성 컨벤션

- Frontmatter에는 `name`과 `description`을 둔다. `description`은 작업 범위를 나열하지 말고 모델이 호출해야 하는 상황만 짧고 구체적으로 설명한다.
- `SKILL.md`는 최소 라우터로 유지한다. 적용 조건, 필요한 입력, 결과, 승인·중단 경계와 reference 연결만 두고 세부 workflow·예시·긴 배경은 필요한 reference로 늦게 공개한다.
- Skill 설명과 본문에 다른 Skill보다 먼저 선택되도록 유도하는 표현을 넣지 않는다. 겹치는 Skill은 사용자 요청과 실제 파일·플랫폼·workflow 조건으로 구분한다.
- 모델이나 에이전트 버전에 의존하는 절차를 기본값으로 굳히지 않는다. 같은 결과를 내는 가장 단순한 절차를 우선하고, 불필요한 질문·전체 탐색·반복 검증을 요구하지 않는다.
- Skill의 명시적 경계가 사용자 요청과 충돌하면 사용자 요청을 우선한다. 그 경계 때문에 멈추거나 방향을 바꿀 때는 정확한 Skill 경로와 인용할 문장을 남긴다.

## 의존성이 제공하는 스킬

일부 패키지는 자기 `skills/` 디렉토리를 함께 배포한다. 그런 스킬은 이 디렉토리에 복사해 두지 않는다. 손으로 옮기면 라이브러리를 판올림할 때마다 스킬이 뒤처지고, 뒤처졌다는 사실이 드러나지 않는다.

대신 루트 `package.json`의 `prepare` 스크립트가 `skills-npm`을 돌려서 `node_modules` 안의 스킬로 symlink를 건다. `bun install` 때마다 다시 걸리므로 스킬과 라이브러리의 버전이 어긋나지 않는다.

- 링크는 `packages/cli/.claude/skills/npm-<패키지>-<스킬>`에 생기고 `.gitignore`가 무시한다. 커밋되는 것은 `prepare` 스크립트와 무시 규칙뿐이다.
- `--cwd packages/cli`로 범위를 좁혀 둔 이유는, Claude Code가 하위 디렉토리의 `.claude/skills/`를 그 디렉토리 파일을 읽거나 편집할 때 비로소 불러오기 때문이다. CLI 코드를 만지지 않는 세션에서는 목록에 뜨지 않는다.
- `--agents claude-code`로 고정한 이유는, 자동 탐지가 아무 에이전트도 찾지 못하면 CI 밖에서 종료 코드 1로 끝나 `bun install` 전체를 실패시키기 때문이다. 다른 에이전트를 쓴다면 이 목록에 추가한다.
- 새 의존성이 스킬을 싣기 시작하면 자동으로 함께 걸린다. 원하지 않으면 `skills-npm`의 `exclude`로 막는다.
