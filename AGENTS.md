# SEED Design

디자인 토큰(Rootage)·Recipe(qvism)·CSS·React·Lynx 구현과 문서·Figma·MCP·CLI 도구를 함께 관리하는 Bun 모노레포다.

## 시작

1. 루트 [`AGENT_LEARNINGS.md`](AGENT_LEARNINGS.md)를 끝까지 읽고, 현재 작업에 해당하는 항목을 계획에 반영한다. 읽기·갱신 규칙은 아래 학습 기록 섹션에 있다.
2. 루트부터 대상 경로까지의 `AGENTS.md`를 모두 읽는다. 하위 문서가 더 좁은 규칙과 검증 명령을 둔다.
3. 여러 패키지에 걸친 변경이거나 어디서 시작할지 모르면 [`ARCHITECTURE.md`](ARCHITECTURE.md)를 읽는다.
4. 테스트·TypeScript 코드를 쓰거나 의존성·changeset·릴리스를 다루면 [`TECH.md`](TECH.md)를 읽는다.
5. 요청과 직접 관련된 코드·설정·문서만 연다.

## 검증

변경 경로의 명령만 실행한다. 하위 `AGENTS.md`에 검증 명령이 있으면 그것을 따른다. 문서·`AGENTS.md`·Skill처럼 실행 동작이 없는 변경은 내용·링크·형식 검토로 끝낸다.

- `packages/react-headless/*/` → `bun headless:test`
- `packages/react/` → `bun react:test`
- `packages/lynx-react/`, `packages/lynx-react-headless/*/` → `bun test:lynx-react`
- `packages/rootage/`, `ecosystem/rootage/` → `bun rootage:test`
- `docs/` → `bun docs:test`
- `tools/extract-api-surface/` → `bun --filter @seed-design/extract-api-surface test && bun --filter @seed-design/extract-api-surface typecheck`
- `.github/scripts/build-api-surface-diff-comment.ts`, `.github/scripts/list-public-packages.ts` → `bun test ./.github/scripts/build-api-surface-diff-comment.test.ts ./.github/scripts/list-public-packages.test.ts`
- 그 밖에 테스트가 있는 경로 → `bun test <경로>`. 예: `bun test packages/cli`, `bun test ecosystem/qvism`
- 여러 패키지에 걸친 변경을 마칠 때 → `bun test:all`

함정:

- React 테스트는 headless 패키지의 `lib/` 빌드를 import한다. headless를 고쳤거나 `lib/`가 없으면 CI처럼 `bun utils:build && bun headless:build`를 먼저 실행한다. Lynx는 `bun lynx-headless:build`다.
- 루트 `bun test`는 `**/lynx-react*/**`를 제외한다. Lynx 패키지는 `bun test:lynx-react`(typecheck + Vitest)로 돌린다.
- `bun rootage:test`의 validator는 미사용 schema property를 지우며 원본 YAML을 다시 쓸 수 있다. 실행 뒤 `git diff`로 의도한 변경만 남았는지 확인한다.

## 생성

생성물은 직접 고치지 않는다. `git check-attr linguist-generated -- <파일>`이 `set`이면 생성물이다. 원천은 `.gitattributes`이고, 수동 관리 예외는 해당 패키지 `AGENTS.md`에 있다.

1. 원천을 고친다.
2. 영향받는 단계만 실행한다.
   - `packages/rootage/` YAML → `bun rootage:generate && bun qvism:generate`
   - `packages/qvism-preset/src/recipes/`, `packages/lynx-qvism-preset/src/recipes/` → `bun qvism:generate`
   - `docs/registry/` → `bun docs:generate`
   - 범위가 넓거나 불확실함 → `bun generate:all`
3. `git diff`로 의도한 생성물만 바뀌었는지 확인한다.

생성 명령이 성공했는데 생성물이 그대로면 `bun ecosystem:build && bun install` 후 다시 실행한다. workspace bin 링크가 없으면 다른 CLI가 조용히 실행된다. 원천과 산출물의 대응은 `ARCHITECTURE.md`「생성 파이프라인」에 있다.

## 경계

사용자에게 먼저 확인할 작업:

- 새 패키지나 외부 의존성 추가
- `tsconfig`, `biome.json`, `.github/workflows/` 변경
- 데이터 삭제, Git 복원·브랜치 전환, 외부 서비스 쓰기, publish, merge
- 요청받지 않은 commit, push, PR 생성·갱신. 단, 학습 기록 섹션에 따른 `AGENT_LEARNINGS.md` 커밋은 확인 없이 한다.

그 밖의 읽기·로컬 수정·테스트·생성은 묻지 않고 진행한다. 확인이 필요한 작업도 준비와 로컬 검증은 먼저 끝낸다.

- 패키지 매니저는 `bun`만 쓴다. 의존성은 `bun add`로 바꾸고 `bun.lock`은 손으로 고치지 않는다.
- 포맷은 변경한 파일만 `bun biome format --write <파일>`로 맞춘다.
- `.env`, API key, secret은 읽거나 커밋하지 않는다.
- 사용자 요청이 Skill 지침보다 우선한다. Skill 지침 때문에 멈추거나 방향을 바꾸면 근거가 된 `SKILL.md` 경로와 문장을 사용자에게 밝힌다.
- Lynx 기기에서 `open`·reload·화면 조작을 하기 전에 [session 소유권과 Card 수명](skills/seed-verify-lynx-component/references/concurrency/session-ownership.md)을 읽고 따른다. 여러 에이전트·worktree가 같은 client를 공유한다.

## 학습 기록

에이전트는 작업하면서 스스로 학습한다. 루트 `AGENT_LEARNINGS.md`는 실수에서 얻은 교훈을 쌓는 외부 메모리이고, 모델을 다시 훈련하지 않고도 작업을 거듭할수록 더 나은 판단을 하는 것이 목표다. 이 파일을 읽고 갱신하는 일을 작업 본문보다 앞에 둔다.

읽기:

- 모든 작업을 시작하기 전에 파일 전체를 읽고 숙지한다. 파일이 없으면 아래 형식으로 즉시 만든다.
- 설계 선택, 되돌리기 어려운 변경, 검증 방법 결정처럼 중요한 결정 전에 다시 읽는다.
- 학습 항목을 계획에 우선 반영해 같은 실수를 반복하지 않는다. 사용자 요청과 충돌하면 사용자 요청을 따르고 충돌한 항목을 알린다.

갱신 시점 — 다음 중 하나가 생기면 하던 작업을 멈추고 즉시 기록한다:

- 에러가 나거나 명령·검증이 실패했다.
- 비효율적인 패턴이나 잘못된 가정을 발견했다.
- 더 나은 접근법을 찾았다.
- 같은 종류의 실수를 반복할 위험이 보인다.

형식 — 교훈 하나를 `## <한 줄 제목>` 항목으로 쓰고, 세 소제목과 모든 필드를 채운다:

```markdown
## <한 줄 제목>

### Mistake Made
- Description: <무슨 실수를 했는지, 왜 그렇게 됐는지>
- Impact: <어떤 영향이 있었는지>

### Patterns to Avoid
- Pattern: <피해야 할 패턴>
- Risk: <왜 위험한지>

### Better Approaches
- Recommendation: <추천하는 방법>
- Solutions: <구체적인 해결책. 명령·코드 스니펫·경로·예시>
```

작성:

- 현상만 적지 말고 원인과 다음에 달리 할 행동을 직접 분석해 적는다.
- 새 항목을 쓰기 전에 비슷한 항목을 찾아 합치거나 일반화한다. 틀렸거나 낡은 항목은 그 자리에서 고치거나 지운다.
- 특정 경로에서 항상 지켜야 할 규칙으로 굳은 교훈은 그 경로의 가장 좁은 `AGENTS.md`로 옮기고 학습 파일에서는 지운다.

커밋 — 파일을 고칠 때마다 바로 이 파일만 커밋해 변경 이력을 남긴다:

```bash
git add AGENT_LEARNINGS.md
git commit -m "docs(learnings): <교훈 요약>" -- AGENT_LEARNINGS.md
```

- 경로를 지정해 커밋하므로 작업 중인 다른 변경은 섞이지 않는다. 메시지는 Git 섹션의 규칙을 따르고 제목에 교훈을 요약한다.
- 이 커밋은 사용자 확인 없이 한다. push는 경계 섹션대로 먼저 확인한다.
- 커밋했으면 완료 응답에 기록한 교훈과 커밋 해시를 알린다.

## 문서

- `AGENTS.md`: 에이전트 규칙·명령·경계. `AGENT_LEARNINGS.md`: 에이전트가 쌓는 실수·교훈. `ARCHITECTURE.md`: 패키지 경계·생성 파이프라인·변경 유형별 시작 경로. `TECH.md`: 저장소 공통 기술 규칙. `README.md`·`CONTRIBUTING.md`: 사람용.
- 새 규칙은 가장 좁은 적용 경로의 `AGENTS.md`에 두고 상위 문서에 반복하지 않는다.
- 하위 `AGENTS.md`는 `# <경로>` 제목과 1–2문장 개요로 시작하고, 내용이 있는 섹션만 둔다. 검증 명령이 있으면 `## 검증`을 맨 앞에 두고, 그 밖에는 `## 규칙`·`## 작업 절차`를 쓴다. 코드·설정으로 알 수 있는 내용과 일반론은 쓰지 않는다.
- 에이전트 문서는 표 대신 짧은 목록, 한다체로 쓴다. 금지 규칙에는 대신 할 행동을 함께 쓴다.

## Git

커밋 메시지와 PR 제목은 영어 Conventional Commits(`type(scope): subject`)로 쓴다. 예: `feat(button): add loading state`.
