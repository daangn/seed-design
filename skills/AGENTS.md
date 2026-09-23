# skills

저장소 전용 Skill의 단일 원천이다. `.claude/skills`, `.claude/plugins/seed-design/skills`, `.agents/skills`는 이 디렉터리를 가리키는 symlink다 → symlink 쪽 경로를 고치지 말고 여기를 고친다.

## 검증

- `scripts/`를 고쳤으면 그 script를 설명하는 reference의 예시 명령으로 실행하고, 인자·출력 필드가 설명과 맞는지 확인한다.
- reference 파일명·경로나 다른 문서가 링크하는 제목을 바꿨으면 `SKILL.md`와 다른 문서에서 옛 경로·anchor를 검색해 함께 고친다.

## 규칙

### 디렉터리

- 새 Skill 디렉터리는 `seed-*` 접두사의 kebab-case로 만들고 `SKILL.md`를 둔다. 기존 `chromatic-diff`는 예외다.
- 부가 자료는 해당 Skill의 `references/`, `scripts/`, `assets/`에 두고 상대 경로는 Skill 디렉터리 기준으로 쓴다. `agents/openai.yaml`은 OpenAI 에이전트용 표시 metadata다.
- 여러 Skill이 공유하는 규칙은 각 Skill에 복사하지 말고 이 파일이나 공통 reference 한 곳에 둔다.
- 말투는 루트 `AGENTS.md`「문서」대로 한다체다. 예외: `seed-design`은 `docs/content/ai-integration/skill/`에 그대로 노출되고 외부 프로젝트에 배포되는 공개 Skill이라 합니다체를 유지하고, `chromatic-diff`는 영어 원문을 유지한다.

### `SKILL.md`

- frontmatter에는 `name`과 `description`을 둔다. `description`은 작업 범위를 나열하지 말고 모델이 호출해야 하는 상황만 짧고 구체적으로 쓴다.
- 본문은 최소 라우터다: 적용 조건, 필요한 입력, 결과, 승인·중단 경계, reference 연결만 둔다. 세부 workflow·예시·긴 배경은 필요한 분기에서만 읽히는 reference로 옮긴다.
- 다른 Skill보다 먼저 선택되도록 유도하는 표현을 넣지 않는다 → 겹치는 Skill은 사용자 요청과 실제 파일·플랫폼·workflow 조건으로 구분한다.
- 특정 모델·에이전트 버전에 의존하는 절차를 기본값으로 두지 않는다 → 같은 결과를 내는 가장 단순한 절차를 쓰고, 불필요한 질문·전체 탐색·반복 검증을 요구하지 않는다.
