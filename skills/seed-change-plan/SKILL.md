---
name: seed-change-plan
description: 현재 SEED Design 변경이나 계획 경로의 패키지·생성물·플랫폼 영향과 검증 순서를 읽기 전용으로 만들고, 확정 changeset과 origin/dev·origin/minor·origin/major 차이를 근거로 PR 기준 브랜치를 정한다. 구현 전 작업 계획, 검증 범위, changeset 필요 여부, targetBranch·targetRef·prBase 판단이 필요할 때 사용한다.
user-invocable: true
argument-hint: "[--base-ref origin/dev|origin/minor|origin/major] [--path <경로>] [--planned <경로>] [--lane minor|major|none] [--bump patch|minor|major | --no-release]"
---

# SEED 변경 계획

현재 체크아웃을 읽어 작업 영향과 검증 순서를 먼저 확정합니다. 이 스킬은 파일, Git 상태, 원격 브랜치를 바꾸거나 계획한 명령을 실행하지 않습니다.

## 절차

1. 저장소 루트에서 다음 스크립트를 실행합니다.

   ```bash
   bun skills/seed-change-plan/scripts/change-plan.ts --base-ref origin/dev
   ```

   `--base-ref`에는 현재 feature 브랜치가 실제로 갈라진 기준을 지정합니다. 리베이스 전에는 기존 기준 브랜치를 사용하고, 리베이스를 마친 뒤 최종 재실행할 때만 확정된 `targetRef`를 사용합니다. 아직 만들지 않은 파일은 `--planned <저장소 상대 경로>`로 추가합니다. 특정 경로만 분석할 때는 `--path`를 반복하며, 이 경우 영향 분석만 필요하면 `--base-ref`를 생략할 수 있습니다.

2. `impact`에서 다음 항목을 확인합니다.
   - `packages`: 직접 영향을 받는 workspace 패키지
   - `surfaces`: 원천, 생성물, 구현, 문서, 예제, 테스트, 릴리스, 도구 구분
   - `components`, `platforms`: 컴포넌트와 React·Lynx 영향

3. `verification`을 표시된 순서대로 검토합니다. 각 단계의 `source`로 루트 정책, package script, 위임 스킬 또는 수동 점검 중 어느 근거에서 나온 항목인지 확인합니다. 계획 단계에서는 실행하지 않습니다.

4. `branchEvidence`가 완전한지 확인합니다.
   - `complete`가 `false`이거나 `errors`가 있으면 bump나 `--no-release`와 관계없이 브랜치는 `unknown`입니다.
   - 암시적으로 Git 변경을 수집할 때 `--base-ref`가 없으면 브랜치를 확정하지 않습니다.
   - rename은 이전·새 경로를 모두 보존합니다. 현재 checkout에서 사라진 공개 패키지는 `baseRef`의 `package.json`으로 확인합니다.

5. `laneCandidates`는 브랜치 전용 작업과 경로가 겹친다는 후보일 뿐 확정 근거가 아닙니다. 후보가 있으면 양쪽 diff를 직접 확인합니다.

   ```bash
   git diff --name-status origin/dev...origin/minor -- <후보-경로>
   git diff --name-status origin/dev...origin/major -- <후보-경로>
   ```

   확인 결과에 따라 `--lane minor`, `--lane major`, `--lane none` 중 하나로 다시 실행합니다. 후보만으로 lane을 자동 선택하지 않습니다.

6. `branch.targetBranch`, `targetRef`, `prBase`가 모두 같은지 확인합니다.
   - 직접 확인한 결과 `minor`나 `major`의 미출시 작업을 수정하면 해당 lane을 명시합니다.
   - 그 외에는 확정 bump 중 가장 높은 값으로 정합니다. `patch`는 `dev`, `minor`는 `minor`, `major`는 `major`입니다.
   - 릴리스가 없는 문서·스킬·내부 도구 변경은 `dev`입니다.
   - 브랜치 전용 근거와 bump가 충돌하거나 배포 패키지의 bump가 미확정이면 `unknown`입니다.

7. bump를 확정하기 전에는 `--bump`를 넣지 않습니다. `seed-changeset`으로 사용자가 bump를 확정한 뒤 최종 제출 직전에 다시 실행합니다. 사용자가 changeset이 필요 없다고 확정한 경우에만 `--no-release`를 사용합니다.

8. 확정한 `targetRef`와 `prBase`를 `seed-submit-change`에 넘깁니다. 제출 스킬은 같은 기준으로 리베이스, 커밋, push, PR 생성 또는 갱신을 수행해야 합니다.

## 경계

- `unknown`을 임의의 브랜치로 바꾸지 않습니다.
- `laneCandidates`의 경로 교집합을 브랜치 확정 근거로 사용하지 않습니다.
- `origin/dev`, `origin/minor`, `origin/major`의 SHA가 같아도 선택한 브랜치 이름을 다른 이름으로 바꾸지 않습니다.
- 생성물 경로가 보이면 대응 원천과 `bun generate:all`을 확인하며 생성물을 직접 수정하지 않습니다.
- 명령 실행과 결과 판정은 에이전트의 기본 셸이 맡습니다. 세션 baseline, 로그 저장, 실패 지문 분류는 만들지 않습니다.
- 리베이스, 커밋, push, PR 생성·갱신은 `seed-submit-change`가 맡습니다.
