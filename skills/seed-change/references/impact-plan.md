# 변경 계획

현재 체크아웃을 읽어 작업 영향, 검증 순서, 기준 브랜치를 확정한다. 이 분기는 파일·Git 상태·원격 브랜치를 바꾸지 않고, 계획한 명령도 실행하지 않는다.

## 스크립트 인자

`bun skills/seed-change/scripts/change-plan.ts`는 저장소 루트에서 실행하고 JSON을 출력한다.

- `--base-ref <ref>`: `origin/dev`, `origin/minor`, `origin/major`만 받는다. 없으면 커밋된 변경을 모으지 못해 `branchEvidence.errors`에 남고 브랜치는 `unknown`이 된다.
- `--path <경로>`: 반복할 수 있다. 주면 Git 변경 수집을 건너뛰고 이 경로만 분석한다. 영향 분석만 필요하면 이때 `--base-ref`를 생략할 수 있다.
- `--planned <경로>`: 반복할 수 있다. 아직 만들지 않은 파일을 저장소 상대 경로로 더한다.
- `--lane minor|major|none`: 직접 확인한 lane을 확정한다.
- `--bump patch|minor|major`: 반복할 수 있고 가장 높은 값이 브랜치를 정한다. `--no-release`와 함께 쓰면 오류다.
- `--no-release`: 사용자가 changeset이 필요 없다고 확정했을 때만 쓴다.

변경 경로에 `.changeset/*.md`가 있으면 스크립트가 그 frontmatter의 bump를 읽어 `confirmedBumps`에 더한다. 이때 `--no-release`를 주면 오류다.

## 절차

1. 스크립트를 실행한다.

   ```bash
   bun skills/seed-change/scripts/change-plan.ts --base-ref origin/dev
   ```

   `--base-ref`에는 현재 feature 브랜치가 실제로 갈라진 기준을 준다. 리베이스 전에는 기존 기준 브랜치를 쓰고, 리베이스를 마친 뒤 최종 재실행할 때만 확정된 `targetRef`를 쓴다.

2. `impact`를 확인한다.
   - `packages`: 직접 영향을 받는 workspace 패키지. `private`는 manifest에 boolean 필드가 없으면 `"unknown"`이고, `true`가 아닌 패키지(`packages/archive/*` 제외)는 배포 가능한 패키지로 센다.
   - `surfaces`: 경로를 `source`, `generated`, `implementation`, `docs`, `registry`, `examples`, `tests`, `release`, `tooling`으로 나눈 결과
   - `components`, `platforms`: 영향 컴포넌트와 플랫폼(`react`, `lynx`, `shared`, `docs`, `tooling`)

3. `verification`을 표시된 순서대로 검토한다. 각 단계의 `kind`(`command`·`skill`·`manual`)와 `source`(루트 `AGENTS.md` 절, `package.json` script, Skill reference)로 근거를 확인한다. 첫 단계는 항상 `bun generate:all`, 마지막은 `bun test:all`이다. 계획 단계에서는 실행하지 않는다.

4. `branchEvidence`가 완전한지 확인한다.
   - `complete`가 `false`이거나 `errors`가 있으면 bump나 `--no-release`와 관계없이 브랜치는 `unknown`이다.
   - rename은 이전·새 경로를 모두 보존한다. 현재 checkout에서 사라진 공개 패키지는 `baseRef`의 `package.json`으로 확인한다.

5. `branchEvidence.laneCandidates`는 `origin/dev...origin/minor`·`origin/dev...origin/major` diff와 경로가 겹친다는 후보일 뿐이다. 후보가 있고 `--lane`이 없으면 브랜치는 `unknown`이다. 양쪽 diff를 직접 확인한다.

   ```bash
   git diff --name-status origin/dev...origin/minor -- <후보-경로>
   git diff --name-status origin/dev...origin/major -- <후보-경로>
   ```

   확인 결과에 따라 `--lane minor`, `--lane major`, `--lane none` 중 하나로 다시 실행한다. 후보만 보고 lane을 고르지 않는다.

6. `branch`의 `targetBranch`, `targetRef`, `prBase`가 같은 브랜치를 가리키는지 확인한다. 스크립트의 결정 순서는 다음과 같다.
   - `--lane minor`나 `--lane major`가 있으면 그 lane이다. 확정 bump가 가리키는 브랜치와 다르면 `unknown`이다.
   - 그 밖에는 확정 bump 중 가장 높은 값으로 정한다. `patch` → `dev`, `minor` → `minor`, `major` → `major`.
   - 배포 가능한 패키지가 없는 문서·Skill·내부 도구 변경은 `dev`다.
   - 배포 가능한 패키지가 바뀌었는데 bump도 `--no-release`도 없으면 `unknown`이다.

7. bump를 확정하기 전에는 `--bump`를 넣지 않는다. [changeset](changeset.md) 분기에서 사용자가 bump를 확정한 뒤 최종 제출 직전에 다시 실행한다.

8. 확정한 `targetRef`와 `prBase`를 보고한다. `uncertainties`가 있으면 함께 보고한다. 제출은 사용자가 명시적으로 요청했을 때만 [submit.md](submit.md)가 같은 기준으로 진행한다.

## 경계

- `unknown`을 임의의 브랜치로 바꾸지 않는다 → 원인(`branch.reason`, `uncertainties`)을 보고하고 필요한 확인을 요청한다.
- `origin/dev`, `origin/minor`, `origin/major`의 SHA가 같아도 선택한 브랜치 이름을 다른 이름으로 바꾸지 않는다.
- `surfaces`에 `generated`가 보이면 생성물을 직접 고치지 않는다 → 루트 `AGENTS.md`「생성」에 따라 원천을 찾는다.
- 명령 실행과 결과 판정은 에이전트의 기본 셸로 한다. 세션 baseline, 로그 저장, 실패 지문 분류를 따로 만들지 않는다.
