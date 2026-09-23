---
name: seed-change
description: SEED 변경의 영향·검증·기준 브랜치를 판단하거나, 공개 패키지 changeset을 작성하거나, 명시적으로 요청받은 rebase·commit·push·PR 제출을 할 때 사용한다.
user-invocable: true
argument-hint: "[계획 | changeset | 제출] [--base-ref origin/dev|origin/minor|origin/major] [--path <경로>] [--planned <경로>] [--lane minor|major|none] [--bump patch|minor|major | --no-release]"
---

# SEED 변경

요청 결과로 분기 하나를 고른다. 명시가 없으면 `계획만`이다. 한 분기의 실행이나 승인은 다음 분기의 실행 권한이 아니며, 계획 결과나 변경 파일만을 근거로 다음 분기로 넘어가지 않는다.

| 분기 | 입력 | 결과 | 승인·중단 경계 | 절차 |
| --- | --- | --- | --- | --- |
| 계획만 | 현재 checkout, 실제 분기 기준 `--base-ref`, 확정된 `--lane`·`--bump`·`--no-release` | 영향 패키지·표면, 검증 순서, `targetBranch`·`targetRef`·`prBase` | 읽기 전용. Git 상태·파일·원격을 바꾸지 않는다. 브랜치 값이 `unknown`이면 제출 불가다. | [impact-plan.md](references/impact-plan.md) |
| changeset | 기준 브랜치, 공개 패키지 후보 | 패키지별 bump·근거, 한국어 초안, 승인 뒤 `.changeset/*.md` | 후보 분석은 읽기 전용. 현재 요청에서 bump·문안이 확정되지 않았으면 승인 뒤에만 파일을 쓴다. dependency range는 수정하지 않는다. | [changeset.md](references/changeset.md) |
| 제출 | 명시적 제출 요청, 확정한 계획의 `targetRef`·`prBase` | rebase된 feature 브랜치, commit, push, PR base | 포함 파일·commit, push, PR 생성·base 변경을 각각 현재 요청의 승인 범위에서 확인한다. `unknown`, 기준·원격 SHA 변화에서 중단한다. | [submit.md](references/submit.md) |

두 CLI는 저장소 루트에서 Bun으로 직접 실행하고 JSON을 출력한다.

```bash
bun skills/seed-change/scripts/change-plan.ts --base-ref origin/dev
bun skills/seed-change/scripts/changeset-plan.ts --base-ref origin/dev
```

제출에는 실행 스크립트가 없다. rebase·push·PR 명령은 [submit.md](references/submit.md)의 확인 순서대로 직접 실행한다.
