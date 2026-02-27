## 디렉토리 개요
레포 루트 기준 `skills/`는 seed-design 스킬의 단일 원천(source of truth)이다. Claude가 읽는 `.claude/skills`와 `.claude/plugins/seed-design/skills`는 이 디렉토리를 참조하도록 연결한다.

## 파일 작성 컨벤션
- 스킬 디렉토리명은 kebab-case를 사용한다.
- 각 스킬 디렉토리는 반드시 `SKILL.md`를 포함한다.
- 부가 자료는 `details/`, `references/`, `scripts/`, `assets/` 하위에 둔다.
- Claude 훅 규칙 파일은 루트의 `skill-rules.json`으로 관리한다.
- 신규/수정은 이 디렉토리에서만 수행하고, 반영 시 `.agents/skills`로 복사한다.

## 코드 작성 컨벤션
- `SKILL.md` frontmatter에는 최소 `name`, `description`을 유지한다.
- 스킬 본문에서 참조하는 상대 경로는 스킬 디렉토리 기준으로 작성한다.
- 스킬 간 중복 규칙은 공통 문서로 이동하고, 개별 스킬에는 실행 절차와 예시만 둔다.
- Codex에서 심볼릭 링크 인식 이슈가 발생할 수 있으므로 `.agents/skills`는 직접 수정하지 않고 항상 이 디렉토리 기준으로 동기화한다.
